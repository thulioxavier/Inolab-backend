import { Request, response, Response } from "express";

import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();


interface JsonResponse {
    data: Array<object>,
    error: Object | string,
}
let json: JsonResponse = { data: [], error: {} };

export const CreateSubject = async (req: Request, res: Response) => {
    const { name, icon} = req.body;

    try {
        const response = await db.subject.create({
            data: {
                name,
                icon,
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

export const SelectAreas = async (req: Request, res: Response) => {
    try {
        const response = await db.subject.findMany({where: {show: true}});
        json.data = response ;
        return res.status(200).json(json);
    } catch (error) {
        console.log(error)
        json.error = { error };
        return res.status(500).send(json.error);
    }
}


