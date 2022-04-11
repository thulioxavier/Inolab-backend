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
    time_spent: number,
    difficulty: number,
    date: string,
    id_user: number,
}

const Difficulty = {
    "0": 120,
    "1": 240,
    "2": 360,
    "3": 480,
    "4": 600,
    "5": 720
}

const formatData = async (date: Date) => {
    let dateAno = date.getFullYear();
    let dateDia: number | string = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let dateMes: number | string = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    return (`${dateAno}-${dateMes}-${dateDia}`) as string;
}

export const CreateAnswer = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object };

    let {
        id_question,
        id_option,
        status,
        time_spent,
        difficulty,
        id_user } = req.body;

    let points = 0;

    switch (difficulty) {
        case 0:
            points = Difficulty["0"];
            break;
        case 1:
            points = Difficulty["1"];
            break;
        case 2:
            points = Difficulty["2"];
            break;
        case 3:
            points = Difficulty["3"];
            break;
        case 4:
            points = Difficulty["4"];
            break;
        case 5:
            points = Difficulty["5"];
            break;
        default:
            break;
    }
    try {
        await db.answer.create({
            data: {
                id_option,
                id_question,
                id_user,
                status,
                points,
                time_spent,
                answer_date: new Date().toDateString()
            }
        }).then((response) => {
            json.data = { status: true };
            return res.status(200).json(json);
        }).catch((reject) => {
            json.data = { status: false };
            json.error = "Não foi possível salvar a sua resposta!"
            return res.json(json);
        });

    } catch (error) {
        json.data = { status: false };
        json.error = "Erro ao salvar resposta!";
        throw new Error("Erro ao salvar resposta!");
    }
}

