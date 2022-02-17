import { Request, Response } from 'express';
import { Error } from '../../errors/Erros';
import { UserServices } from '../../services';
import { TokenUserServices } from '../../services/TokenUserServices';
import { CryptoPass } from '../../utils/PasswordCript';
import { TokenUser } from '../../utils/TokenUser';

import bcrypt from 'bcryptjs';


import JWT from 'jsonwebtoken';

import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

type PersoneModel = {
    email: string,
    name: string,
    password: string
    registration: string,
    last_name: string
}

interface JsonResponse {
    data: Object,
    error: Object | string,
}

export const CreateUser = async (req: Request<PersoneModel>, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object };

    const { email, name, password, registration, lastName } = req.body;

    try {

        if (await UserServices.userByEmail(email) <= 0) {

            UserServices.create({
                email,
                name,
                password: await CryptoPass.newPass(password),
                registration,
                last_name: lastName
            }).then(async (resultUser) => {

                await TokenUserServices.create({
                    id_user: Number(resultUser?.id),
                    token: await TokenUser.newToken(),
                }).then((resultToken) => {
                    json.data = { status: true, resultToken };
                    return res.json(json);
                }).catch(async (reject) => {
                    const e = await Error.SelectError(reject.code);
                    json.data = { status: false };
                    json.error = "Não foi possível gerar seu token no momento!!";
                    return res.json(json);
                });

            }).catch(async (reject) => {
                const e = await Error.SelectError(reject.code);
                json.data = { status: false };
                json.error = "Não foi possível se cadastrar no momento!!";
                return res.json(json);
            });
        } else {
            json.data = { status: false }
            json.error = 'Esse E-mail já esté em uso por outro usuário!';
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
            }
        });

        if (user) {
            const hash: string = user?.password as string;

            const match = await bcrypt.compareSync(password, hash)

            if (match) {
                const TOKEN = JWT.sign(
                    {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    },
                    process.env.JWT_SECRET_KEY as string,
                    {
                        expiresIn: '24h'
                    }
                );
                json.data = {
                    status: true,
                    TOKEN
                }
                return res.json({ json });
            }
            return res.json({ json: false });
        }
    }

    return res.status(500).json({ json: false });

}

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
                avatar: true
            },
            orderBy: {
                id: 'desc'
            }
        });
        json.data = response;
        res.json(json);
    } catch (error) {
        json.error = { error };
        console.log(error)
        return res.status(500).send(json.error);
    }
}