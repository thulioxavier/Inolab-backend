import { Request, Response } from "express";
import { Error } from "../../errors/Erros";
import { UserServices } from "../../services";
import { TokenUserServices } from "../../services/TokenUserServices";
import { CryptoPass } from "../../utils/PasswordCript";
import { TokenUser } from "../../utils/TokenUser";

import bcrypt from "bcryptjs";

import JWT from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
import { userInfo } from "os";
const db = new PrismaClient();

type PersoneModel = {
    email: string;
    name: string;
    password: string;
    registration: string;
    last_name: string;
};

interface JsonResponse {
    data: Object;
    error: Object | string;
}

const NewError = (status: boolean, msgError: string): object => {
    let json: JsonResponse = { data: Object, error: Object };
    json.data = { status: status };
    json.error = msgError;
    return json;
};

const percent = (total: number, valor: number): number => {
    let aux: string = ((valor / total) * 100).toFixed(2);
    return (Number(aux))
}

export const CreateUser = async (req: Request<PersoneModel>, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object };

    const { email, name, password, registration, lastName } = req.body;

    try {
        if ((await UserServices.userByEmail(email)) <= 0) {
            UserServices.create({
                email,
                name,
                password: await CryptoPass.newPass(password),
                registration,
                last_name: lastName,
            })
                .then(async (resultUser) => {
                    await TokenUserServices.create({
                        id_user: Number(resultUser?.id),
                        token: await TokenUser.newToken(),
                    })
                        .then((resultToken) => {
                            json.data = { status: true, resultToken };
                            return res.json(json);
                        })
                        .catch(async (reject) => {
                            const e = await Error.SelectError(reject.code);
                            json.data = { status: false };
                            json.error = "Não foi possível gerar seu token no momento!!";
                            return res.json(json);
                        });
                })
                .catch(async (reject) => {
                    const e = await Error.SelectError(reject.code);
                    json.data = { status: false };
                    json.error = "Não foi possível se cadastrar no momento!!";
                    return res.json(json);
                });
        } else {
            json.data = { status: false };
            json.error = "Esse E-mail já esté em uso por outro usuário!";
            return res.json(json);
        }
    } catch (error) {
        json.data = { status: false };
        json.error = "Não foi possível se cadastrar no momento!!";
        return res.send(json);
    }
};

export const Login = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object };

    let email: string = req.body.email;
    let password: string = req.body.password;

    if (email && password) {
        const user = await db.user.findFirst({
            where: {
                email,
            },
        });

        if (user) {
            const hash: string = user?.password as string;

            const match = await bcrypt.compareSync(password, hash);

            if (match) {
                const TOKEN = JWT.sign(
                    {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    },
                    process.env.JWT_SECRET_KEY as string,
                    {
                        expiresIn: "24h",
                    }
                );
                json.data = {
                    status: true,
                    TOKEN,
                };
                return res.json({ json });
            }
            return res.json({ json: false });
        }
    }

    return res.status(500).json({ json: false });
};

export const SelectUsers = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object };

    try {
        const response = await db.user.findMany({
            select: {
                password: false,
                id: true,
                uuid: true,
                name: true,
                email: true,
                registration: true,
                status: true,
                avatar: true,
            },
            orderBy: {
                id: "desc",
            },
        });
        json.data = response;
        res.json(json);
    } catch (error) {
        json.error = { error };
        console.log(error);
        return res.status(500).send(json.error);
    }
};

export const ShowInfoDash = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object };
    let { user } = req.headers;

    try {
        const metrics: any = {
            hits: {
                points: 0,
                count: 0,
                percent: 0,
            },
            mistakes: {
                points: 0,
                count: 0,
                percent: 0,
            },
            total: {
                points: 0,
                count: 0,
                media: 0,
            },
        };

        await db.answer
            .aggregate({
                where: {
                    id_user: Number(user),
                    status: true,
                },
                _count: true,
                _sum: {
                    points: true,
                },
            })
            .then(async (response) => {
                metrics.hits = {
                    points: response._sum.points ? response._sum.points : 0,
                    count: response._count ? response._count : 0,
                };
                await db.answer
                    .aggregate({
                        where: {
                            id_user: Number(user),
                            status: false,
                        },
                        _count: true,
                        _sum: {
                            points: true,
                        },
                    })
                    .then(async (response) => {
                        metrics.mistakes = {
                            points: response._sum.points ? response._sum.points : 0,
                            count: response._count ? response._count : 0,
                        };
                        await db.answer
                            .aggregate({
                                where: {
                                    id_user: Number(user),
                                },
                                _count: true,
                                _sum: {
                                    points: true,
                                },
                            })
                            .then((response) => {

                                metrics.total = {
                                    points: response._sum.points ? response._sum.points : 0,
                                    count: response._count ? response._count : 0,
                                };

                                metrics.hits.percent = percent(metrics.total.count, metrics.hits.count)
                                metrics.mistakes.percent = percent(metrics.total.count, metrics.mistakes.count)

                                json.data = { status: true, metrics };
                                return res.status(200).json(json);
                            })
                            .catch((reject) => {
                                return res
                                    .status(200)
                                    .json(
                                        NewError(false, "Não foi possivel recuperar suas métricas!")
                                    );
                            });
                    })
                    .catch((reject) => {
                        return res
                            .status(200)
                            .json(
                                NewError(false, "Não foi possivel recuperar suas métricas!")
                            );
                    });
            })
            .catch((reject) => {
                return res
                    .status(200)
                    .json(NewError(false, "Não foi possivel recuperar suas métricas!"));
            });
    } catch (error) {
        return res
            .status(500)
            .json(NewError(false, "Não foi possivel recuperar suas métricas!"));
    }
};
