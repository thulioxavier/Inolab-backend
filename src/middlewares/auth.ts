import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();


export const Auth = {
    private: async (request: Request, response: Response, next: NextFunction) => {
        if(!request.headers.authorization){
            response.status(401).json({
                error:{
                    authorization: false
                }
            });
            return;
        }

        const adminByToken = await db.token_Admin.findUnique({
            where:{
                token: request.headers.authorization
            }
        });

        if (!adminByToken) {
            response.status(401).json({
                error:{
                    authorization: false
                }
            });
            return;
        }

        next();
        return;

    }
}