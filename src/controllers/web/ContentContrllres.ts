import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

interface JsonResponse {
    data: Array<object> | Object,
    error: Object | string | Array<object>,
    status?: Boolean
}

export const CreateContent = async (req: Request, res: Response) => {
    let json: JsonResponse = {status: false ,data: Object, error: Object };


    const {
        title,
        body,
        id_module,
        id_admin,
        abstract,
        url,
        ref,
        example
     } = req.body;

    try {
        await db.content.create({
            data: {
                
                title,
                body,
                example,
                ref,
                url,
                abstract,
                id_module: Number(id_module),
                id_admin,
            }
        }).then(async (response) => {
            json.status = true;
            json.data = {id: response.id};
            return res.status(200).json(json);
        }).catch((reject) => {
            json.status = false;
            json.error = reject;
            return res.status(500).json(json);
        });
    } catch (error) {
        json.status = false;
        json.error = { error };
        return res.status(500).send(json.error);
    }
}

export const SelectContents = async (req: Request, res: Response) => {
    let json: JsonResponse = {status: false ,data: Object, error: Object };
    
    try {
        await db.content.findMany({
            include:{
                modules:{
                    include:{
                        subjects: true
                    }
                }
            }
        }).then((response) => {
            json.status = true;
            json.data = response;
            return res.status(200).send(json);
        }).catch((reject) => {
            json.error = { reject };
            return res.status(500).send(json);
        });
    } catch (error) {
        json.error = { error };
        return res.status(500).send(json.error);
    }
}

