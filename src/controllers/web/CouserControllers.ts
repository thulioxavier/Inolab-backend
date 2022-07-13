import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

interface JsonResponse {
    data: Array<object> | Object,
    error: Object | string | Array<object>,
}

export const CreateCouser = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: [], error: {} };

    const {
        name
    } = req.body;
    
    try {
        await db.course.create({
            data: {
                name
            }
        }).then(async (response) => {
            json.data = { id: response.id };
            return res.status(200).json(json);
        }).catch((reject) => {
            json.error = reject;
            return res.status(200).json(json);
        })
    } catch (error) {
        json.error = { error };
        return res.status(500).send(json.error);
    }

}