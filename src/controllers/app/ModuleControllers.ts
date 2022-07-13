import { Request, response, Response } from "express";

import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

interface JsonResponse {
    data: Array<object> | Object,
    error: Object | string,
    status: Boolean
}


export const CreateModule = async (req: Request, res: Response) => {
    let json: JsonResponse = { status: false, data: Object, error: {} };
    const { name, id_subject, id_admin } = req.body;

    try {
        await db.module.create({
            data: {
                name,
                id_subject: Number(id_subject),
                id_admin
            }
        }).then((response) => {
            json.status = true;
            json.data = response;
            return res.status(200).json(json);
        }).catch((reject) => {
            json.error = reject;
            return res.status(200).json(json);
        });

    } catch (error) {
        json.error = { error };
        return res.status(500).send(json.error);
    }
};

export const SelectModules = async (req: Request, res: Response) => {
    let json: JsonResponse = { status: false, data: Object, error: {} };


    try {
        const response = await db.module.findMany({
            include: {
                subjects: true,
            }
        });
        json.data = response;
        return res.status(200).json(json);
    } catch (error) {
        json.error = { error };
        return res.status(500).send(json.error);
    }
};

export const SelectNewModules = async (req: Request, res: Response) => {
    let json: JsonResponse = { status: false, data: Object, error: {} };


    try {
        const response = await db.module.findMany({
            include: {
                subjects: true,
            },
            skip: 0,
            take: 10,
            orderBy: {
                id: 'desc',
            }
        });
        json.data = response;
        return res.status(200).json(json);
    } catch (error) {
        json.error = { error };
        return res.status(500).send(json.error);
    }
};

export const SelectModulesSubject = async (req: Request, res: Response) => {
    let json: JsonResponse = { status: false, data: Object, error: {} };

    const { id_subject } = req.params;
    try {
        const response = await db.module.findMany({
            where: {
                id_subject: Number(id_subject)
            },
            include: {
                subjects: true,
            },
            orderBy: {
                id: 'desc',
            }
        });
        json.data = response;
        return res.status(200).json(json);
    } catch (error) {
        json.error = { error };
        return res.status(500).send(json.error);
    }
};