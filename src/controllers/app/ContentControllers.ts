import { Request, response, Response } from "express";

import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

interface JsonResponse {
    data: Array<object> | object,
    error: Object | string,
}

export const SelectContent = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: [], error: {} };
    const {id_module} = req.params;

    try {
        const response = await db.content.findMany({
            where:{
                id_module: Number(id_module),
                modules:{
                    subjects:{
                        show: true
                    }
                },
            },

            include: {
                modules: {
                    include: {
                        subjects:true
                    }
                },
            },
        });
        json.data = [response];
        return res.status(200).json(json);
    } catch (error) {
        json.error = { error };
        return res.status(500).send(json.error);
    }
};

export const SelectContentById = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: Object, error: {} };

    const {id} = req.params;
    try {
        const response = await db.content.findFirst({
            where:{
                id: Number(id),
                modules:{
                    subjects:{
                        show: true
                    }
                },
            },

            include: {
                modules: {
                    include: {
                        subjects:true
                    }
                },
            },
        });
        json.data = {status: true, response};
        return res.status(200).json(json);
    } catch (error) {
        json.error = { error };
        return res.status(500).send(json.error);
    }
};