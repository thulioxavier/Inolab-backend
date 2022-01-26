import { Request, Response } from 'express';
import { Error } from '../../errors/Erros';
import { UserServices } from '../../services';
import { TokenUserServices } from '../../services/TokenUserServices';
import { CryptoPass } from '../../utils/PasswordCript';
import { TokenUser } from '../../utils/TokenUser';


import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

type PersoneModel = {
    email: string,
    name: string,
    password: string
    registration: string
}

interface JsonResponse {
    data: Object,
    error: Object | string,
}
let json: JsonResponse = { data: Object, error: Object };

export const CreateUser = async (req: Request<PersoneModel>, res: Response) => {
    const { email, name, password, registration } = req.body;

    try {

        if (await UserServices.userByEmail(email) <= 0) {
            UserServices.create({
                email,
                name,
                password: await CryptoPass.newPass(password),
                registration
            }).then(async (resultUser) => {

                await TokenUserServices.create({
                    id_user: Number(resultUser?.id),
                    token: await TokenUser.newToken(),
                }).then((resultToken) => {
                    json.data = { resultToken, resultUser };
                    return res.status(200).json(json);
                }).catch(async (reject) => {
                    const e = await Error.SelectError(reject.code);
                    reject.msg = e;
                    json.error = { reject };
                    return res.status(500).json(json);
                });

            }).catch(async (reject) => {
                const e = await Error.SelectError(reject.code);
                reject.msg = e;
                json.error = { reject };
                return res.status(500).json(json);
            });
        } else {
            json.error = 'Esse E-mail já esté em uso por outro usuário!';
            return res.status(200).json(json);
        }
    } catch (error) {
        json.error = { error };
        console.log(error)
        return res.status(500).send(json.error);
    }
};


export const SelectUsers = async (req: Request, res: Response) => {
    try {
        const response = await db.user.findMany({
            select: {
                password: false,
                id: true,
                uuid: true,
                name: true,
                email: true,
                registration: true,
            },
            orderBy: {
                id: 'desc'
            }
        });
        json.data = response;
        res.status(200).json(json);
    } catch (error) {
        json.error = { error };
        console.log(error)
        return res.status(500).send(json.error);
    }
}