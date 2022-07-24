import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CryptoPass } from "../../utils/PasswordCript";

const db = new PrismaClient();

export const createAdmin = async (req: Request, res: Response) => {
    try {

        let { email, name, last_name, password } = req.body;

        const admin = await db.admin.findUnique({ where: { email: email } });
        if (admin) {
            res.status(422).json({
                error: {
                    register: {
                        msg: 'Já existe um usuário com esse E-mail!'
                    }
                }
            })
            return;
        }

        const passwordHash = await CryptoPass.newPass(password)

        const data: any = await db.admin.create({
            data: {
                email,
                name,
                last_name,
                password: passwordHash
            }
        })

        await db.token_Admin.create({
            data: {
                id_admin: data.id,
                token: await CryptoPass.newToken()
            }
        })

        res.status(200).json({
            data: {
                success: true,
                user: {
                    uuid: data.uuid,
                    email,
                    name,
                    last_name,
                    full_name: `${name} ${last_name}`
                }
            }
        });
        return;
    } catch (err) {
        console.error(err);

        res.status(422).json({
            error: {
                server: {
                    msg: err
                }
            }
        })
        return;
    }
}

export const signin = async (req: Request, res: Response) => {
    try {

        let { email, password } = req.body;

        const admin = await db.admin.findUnique({ where: { email: email } });

        if (!admin) {
            res.status(422).json({
                error: {
                    auth: {
                        authorization: false,
                        msg: 'E-mail e/ou senha errados!'
                    }
                }
            })
            return;
        }

        if (!await CryptoPass.matchPassword(password, admin.password)) {
            res.status(422).json({
                error: {
                    auth: {
                        authorization: false,
                        msg: 'E-mail e/ou senha errados!'
                    }
                }
            })
            return;
        }

        const newTokenAdmin = await db.token_Admin.update({
            data: {
                token: await CryptoPass.newToken()
            },
            where: { id_admin: admin.id }
        });

        res.status(200).json({
            data: {
                success: true,
                user: {
                    token: newTokenAdmin.token,
                    uuid: admin.uuid,
                    email: admin.email,
                    full_name: `${admin.name} ${admin.last_name}`
                }
            }
        });

        return;

    } catch (error) {
        console.error(error);
        res.status(422).json({
            error: {
                server: {
                    msg: "Erro interno no servidor!"
                }
            }
        })
        return;
    }
}