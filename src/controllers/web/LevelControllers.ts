import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();


export const store = async (req: Request, res: Response) => {
    try {

        const { max_points, min_points, name, level } = req.body;

        console.log(req.body)

        const result = await db.level.createMany({
            data: req.body
        })

        res.status(200).json(result);

    } catch (error) {
        console.log(error)
        res.status(500).json('Falha no servidor!');
    }
}