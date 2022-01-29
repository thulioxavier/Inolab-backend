import { Request, response, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { create } from "domain";
const db = new PrismaClient();

interface JsonResponse {
    data: Array<object>,
    error: Object | string,
}

export const CreateContent = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: [], error: {} };
    const { title, body, id_module, id_admin, abstract } = req.body;
    try {
        await db.content.create({
            data: {
                title,
                body,
                abstract,
                id_module,
                id_admin
            }
        }).then((response) => {
            json.data = [response];
            return res.status(200).json(json);
        }).catch((reject) => {
            console.log(reject);
            json.error = reject;
            return res.status(200).json(json);
        });
    } catch (error) {
        json.error = { error };
        console.log(error)
        return res.status(500).send(json.error);
    }
}

export const CreateContentVideo = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: [], error: {} };
    const { url, title, id_content } = req.body;

    try {
        await db.conetnt_Video.create({
            data: {
                url,
                title,
                id_content,
            }
        }).then((response) => {
            json.error =  [response];
            console.log(response)
            return res.status(200).send(json);
        }).catch((reject) => {
            json.error = { reject };
            console.log(reject)
            return res.status(500).send(json);
        });
    } catch (error) {
        json.error = { error };
        console.log(error)
        return res.status(500).send(json.error);
    }
}

