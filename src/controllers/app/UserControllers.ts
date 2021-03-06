import { Request, Response } from "express";
import { Error } from "../../errors/Erros";
import { UserServices } from "../../services";
import { TokenUserServices } from "../../services/TokenUserServices";
import { CryptoPass } from "../../utils/PasswordCript";
import { TokenUser } from "../../utils/TokenUser";
import { NewError as RequestError } from "../../errors/throwError";

import { PrismaClient } from "@prisma/client";
import { Data } from "../../response/response";
import { User } from "../../models/User";

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
    status: Boolean;
}

const NewError = (status: boolean, msgError: string): object => {
    let json: JsonResponse = { data: Object, error: Object, status: true };
    json.data = { status: status };
    json.error = msgError;
    return json;
};

const percent = (total: number, valor: number): number => {
    let aux: string = ((valor / total) * 100).toFixed(2);
    return (Number(aux))
}

export const CreateUser = async (req: Request<PersoneModel>, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object, status: true };

    const { email, name, password, registration, lastName, sexo } = req.body;

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
                            json.error = "N??o foi poss??vel gerar seu token no momento!!";
                            return res.json(json);
                        });
                })
                .catch(async (reject) => {
                    const e = await Error.SelectError(reject.code);
                    json.data = { status: false };
                    json.error = "N??o foi poss??vel se cadastrar no momento!!";
                    return res.json(json);
                });
        } else {
            json.data = { status: false };
            json.error = "Esse E-mail j?? est?? em uso por outro usu??rio!";
            return res.json(json);
        }
    } catch (error) {
        json.data = { status: false };
        json.error = "N??o foi poss??vel se cadastrar no momento!!";
        return res.send(json);
    }
};

export const Login = async (req: Request, res: Response) => {

    const { body: {email, password} } = req;

    const result = await User.login({ email, password });

    if (result) {
        return res.status(200).json(Data.responseData(200, result));
    }
    return res.status(401).json(RequestError.unauthorized(401, 'Unauthorized Access!'));

}


export const SelectUsers = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object, status: true };

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
        return res.status(500).send(json.error);
    }
};

export const findUserById = async (req: Request, res: Response) => {
    let {id}: any = req.params;

    try {
        
    id = Number(id);

    let user = await User.findOne({id: id});
    
    return res.status(200).json(user);

    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }


}

export const ShowInfoDash = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object, status: true };
    let { user } = req.headers;
    let { pg } = req.params;

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
                            .then(async (response) => {
                                const ArrayChartMetrics: any = [];

                                metrics.total = {
                                    points: response._sum.points ? response._sum.points : 0,
                                    count: response._count ? response._count : 0,
                                };

                                metrics.hits.percent = percent(metrics.total.count, metrics.hits.count)
                                metrics.mistakes.percent = percent(metrics.total.count, metrics.mistakes.count)

                                await db.answer.groupBy({
                                    by: ['answer_date'],
                                    where: {
                                        id_user: Number(user)
                                    },
                                    orderBy: {
                                        answer_date: 'asc'
                                    },
                                    _count: true,
                                }).then(async (chartMetrics) => {
                                    chartMetrics.map((item) => {
                                        ArrayChartMetrics.push({ date: item.answer_date, count: item._count });
                                    });
                                });

                                let history: Array<object> = [];

                                await db.answer.findMany({
                                    where: {
                                        id_user: Number(user),
                                    },
                                    select: {
                                        answer_date: false,
                                        createdAt: false,
                                        id: true,
                                        id_option: false,
                                        id_question: false,
                                        id_user: false,
                                        points: true,
                                        status: true,
                                        time_spent: false,
                                        updatedAt: false,
                                        questions: {
                                            select: {
                                                body: false,
                                                difficulty: true,
                                                id: false,
                                                time: false,
                                                id_content: false
                                            }
                                        }
                                    },

                                    take: pg ? Number(pg) : 10,
                                    orderBy: {
                                        createdAt: 'desc'
                                    }
                                }).then(async (response) => {
                                    history = response
                                });

                                json.data = { status: true, metrics, chart: ArrayChartMetrics ? ArrayChartMetrics : [], history };
                                return res.status(200).json(json);
                            })
                            .catch((reject) => {
                                return res
                                    .status(200)
                                    .json(
                                        NewError(false, "N??o foi possivel recuperar suas m??tricas!")
                                    );
                            });
                    })
                    .catch((reject) => {
                        return res
                            .status(200)
                            .json(
                                NewError(false, "N??o foi possivel recuperar suas m??tricas!")
                            );
                    });
            })
            .catch((reject) => {
                return res
                    .status(200)
                    .json(NewError(false, "N??o foi possivel recuperar suas m??tricas!"));
            });
    } catch (error) {
        return res
            .status(500)
            .json(NewError(false, "N??o foi possivel recuperar suas m??tricas!"));
    }


};

export const SelectDateAnswer = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object, status: true };

    const { date, id_user } = req.params;
    try {

        const right = await db.answer.aggregate({
            where: { answer_date: date, id_user: parseInt(id_user), status: true },
            _sum: {
                points: true,
            }
        });

        const wrong = await db.answer.aggregate({
            where: { answer_date: date, id_user: parseInt(id_user), status: false },
            _sum: {
                points: true,
            }
        });

        json.data = { right, wrong };
        return res.status(200).json(json);

    } catch (error) {
        json.error = { error };
        json.status = false;
        return res.status(500).send(json);
    }
}
