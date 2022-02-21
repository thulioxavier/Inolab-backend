import { Request, response, Response } from "express";

import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();


interface JsonResponse {
    data: Object | Array<object>,
    error: Object | string,
}

interface BodyCreateAnswer {
    id_option: number,
    id_question: number,
    status: boolean,
    points: number,
    time_spent: number
    date: string,
}

const formatData = async (date: Date) => {
    let dateAno = date.getFullYear();
    let dateDia: number | string = date.getDate() < 10 ?"0"+date.getDate() : date.getDate();
    let dateMes: number | string = date.getMonth()+1 < 10 ?"0"+(date.getMonth()+1) : date.getMonth()+1;
    return(`${dateAno}-${dateMes}-${dateDia}`) as string;
}

export const CreateAnswer = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object };

    let { id_user } = req.headers;
    let { id_question, id_option, status, points, time_spent, date }: BodyCreateAnswer= req.body;

    try {
        let paramsDate = new Date();
        await db.answer.create({
            data: {
                id_option,
                id_question,
                id_user: Number(id_user),
                status,
                points,
                time_spent,  
                answer_date: await formatData(paramsDate)
            }
        }).then((response) => {
            json.data = {status: true};
            return res.status(200).json(json);
        }).catch((reject)=>{
            json.data = {status: false};
            json.error = "Não foi possível salvar a sua resposta!"
            return res.json(json);
        });

    } catch (error) {
        console.log(error)
        json.data = { status: false };
        json.error = "Erro ao salvar resposta!";
        throw new Error("Erro ao salvar resposta!");
    }
}

