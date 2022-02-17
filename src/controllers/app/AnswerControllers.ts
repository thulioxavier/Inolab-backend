import { Request, response, Response } from "express";

import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();


interface JsonResponse {
    data: Object | Array<object>,
    error: Object | string,
}


export const CreateAnswer = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object };

    let { id_user } = req.headers;
    let { id_question, id_option, status, points, time_spent } = req.body;

    try {
       
    } catch (error) {
        json.data = {status: false};
        json.error = "Erro ao salvar resposta!";
        throw new Error("Erro ao salvar resposta!");
    }
}