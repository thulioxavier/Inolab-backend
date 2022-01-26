import { Request, response, Response } from "express";

import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

interface JsonResponse {
    data: Array<object>,
    error: Object | string,
}

let json: JsonResponse = { data: [], error: {} };

export const CreateModule = async (req: Request, res: Response) => {
    const { name, id_subject} = req.body;

    try {
        const response = await db.module.create({
            data: {
                name,
                id_subject,
            }
        }).catch((reject) => {
            json.error = reject;
            return res.status(200).json(json);
        });
        json.data = [response];
        return res.status(200).json(json);
    } catch (error) {
        console.log(error)
        json.error = { error };
        return res.status(500).send(json.error);
    }
};

export const SelectModules = async (req: Request, res: Response) => {
    try {
        const response = await db.module.findMany({
            include: {
                subject: true,
            }
        });
        json.data = response ;
        return res.status(200).json(json);
    } catch (error) {
        console.log(error)
        json.error = { error };
        return res.status(500).send(json.error); 
    }
};

export const SelectNewModules = async (req: Request, res: Response) => {
    try {
        const response = await db.module.findMany({
            include: {
                subject: true,
            },
            skip: 0,
            take: 10,
            orderBy: {
                id: 'desc',
            }
        });
        json.data = response ;
        return res.status(200).json(json);
    } catch (error) {
        console.log(error)
        json.error = { error };
        return res.status(500).send(json.error); 
    }
};