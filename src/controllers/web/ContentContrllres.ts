import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

interface JsonResponse {
    data: Array<object> | Object,
    error: Object | string | Array<object>,
}

export const CreateContent = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: [], error: {} };
    const {
        title,
        body,
        id_module,
        id_admin,
        abstract,
        url,
        title_video,
        title_exemple,
        body_ref,
        body_exemple
     } = req.body;

    try {
        await db.content.create({
            data: {
                title,
                body,
                abstract,
                id_module,
                id_admin
            }
        }).then(async (response) => {

            await db.conetnt_Video.create({
                data: {
                    title: title_video,
                    url,
                    id_content: response.id,
                }
            }).catch((reject) => {
                json.error = reject;
            });

            await db.example.create({
                data: {
                    title: title_exemple,
                    id_content: response.id,
                    body: body_exemple,
                }
            }).catch((reject) => {
                json.error = reject;
            });

            await db.reference.create({
                data: {
                    body: body_ref,
                    id_content: response.id,
                }
            }).catch((reject) => {
                json.error = reject;
            });

            json.data = {id: response.id};
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
            json.error = [response];
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

