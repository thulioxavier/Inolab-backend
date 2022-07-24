import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();


export const userCount = async (req: Request, res: Response) => {

    try {
        const users = await db.user.count();

        res.status(200).json({
            data: {
                success: true,
                users: {
                    count: users
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

export const sumPointsByUser = async (req: Request, res: Response) => {
    try {

        const points = await db.$queryRaw`select 
                us.name, 
                us.uuid, 
                us.avatar, 
                us.registration,
            sum(an.points) as pointsByUser 
            from users as us 
                inner join answers as an  on an.id_user = us.id 
            where an.status = true 
            group by us.id 
            order by(pointsByUser) desc;`

            res.status(200).json({
                data: {
                    success: true,
                    users: {
                        points: points
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