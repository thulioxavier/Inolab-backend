import { Request, response, Response } from "express";

import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

interface JsonResponse {
    data: Array<object>,
    error: Object | string,
}


export const modulesCount = async (req: Request, res: Response) => {
    
    try {
        const modules = await db.module.count();

        res.status(200).json({
            data: {
                success: true,
                modules: {
                    count: modules
                }
            }
        })

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