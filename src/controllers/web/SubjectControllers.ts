import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();


interface JsonResponse {
    data: Array<object> | Object | Boolean,
    error: Object | string,
    status: Boolean,
}

export const CreateSubject = async (req: Request, res: Response) => {
    let json: JsonResponse = { status: false, data: [], error: {} };

    const { name, icon } = req.body;

    try {

        await db.subject.create({
            data: {
                name,
                icon,
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

export const subjectsCount = async (req: Request, res: Response) => {
    
    try {
        const subjects = await db.subject.count();

        res.status(200).json({
            data: {
                success: true,
                subjects: {
                    count: subjects
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

export const SelectSubject = async (req: Request, res: Response) => {
    let json: JsonResponse = { status: false, data: [], error: {} };

    try {
        const response = await db.subject.findMany();
        json.data = response;
        return res.status(200).json(json);
    } catch (error) {
        json.error = { error };
        return res.status(500).send(json.error);
    }
};

export const UpdateStatusSubject = async (req: Request, res: Response) => {
    let json: JsonResponse = { status: false, data: [], error: {} };

    const { status } = req.body;
    const { subject_id } = req.params;

    try {
        const response = await db.subject.update({
            data: {
                show: status,
            },
            where: {
                id: Number(subject_id)
            }
        });
        json.data = response;
        return res.status(200).json(json);
    } catch (error) {
        json.error = { error };
        return res.status(500).send(json.error);
    }
}


