import { Request, response, Response } from "express";

import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();


interface JsonResponse {
    data: Object | Array<object>,
    error: Object | string,
}


interface Body {
    time: number,
    body: string,
    difficulty: number,
    title: string,
    question_array: Array<object>
}

interface ArrayData {
    body: string,
    correct: boolean,
    id_question: number,
}

export const CreateQuestion = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object };

    let idQuestion: any = null;

    let {
        time,
        body,
        difficulty,
        title,
        question_array,
    }: Body = req.body;

    let { id_content } = req.headers;

    if (body && difficulty && id_content && title) {
        if (question_array.length >= 0) {
            try {
                const arrayData: any = [];
                await db.question.create({
                    data: {
                        time,
                        body,
                        difficulty,
                        title,
                        id_content: Number(id_content)
                    }
                }).then(async (response) => {

                    idQuestion = response.id as number;

                    question_array.map((item) => {
                        let dataItem: any = item
                        dataItem.id_question = response.id;
                        arrayData.push(dataItem);
                    });

                    await db.option.createMany({
                        data: arrayData
                    }).then(async (response) => {

                        json.data = {
                            id_question: idQuestion,
                            options: response,
                            status: true,
                        };

                        return res.status(200).json(json);
                    }).catch(async (reject) => {
                        await db.question.delete({
                            where: {
                                id: idQuestion
                            }
                        });

                        json.data = { status: false };
                        json.error = "Houve uma falha ao cadastrar as Alternativas!";
                        return res.status(200).json(json);
                    });

                }).catch(async (reject) => {

                    json.data = { status: false };
                    json.error = "Houve uma falha ao cadastrar a Questão!";
                    return res.status(200).json(json);
                });
            } catch (error) {
                json.data = { status: false };
                json.error = "Não foi possível criar uma nova questão no momento!!";
                return res.status(200).json(json);
            }
        } else {
            json.data = { status: false };
            json.error = "Não é possível criar uma Questão sem alternativas!!";
            return res.status(200).json(json);
        }
    } else {

        json.data = { status: false };
        json.error = "Alguns campos não foram preenchidos!";
        return res.status(200).json(json);
    }

};


export const SelectQuestionById = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object };
    let { id_question } = req.params;

    if (id_question) {
        try {
            await db.question.findMany({
                where: {
                    id: Number(id_question),
                },
                include: {
                    options: true,
                }
            }).then((response) => {
                if (response.length <= 0) {
                    json.data = { status: false };
                    json.error = "Nenhuma Questão encontrada!!";
                } else {
                    let data: any = response;
                    data.status = true;
                    json.data = data;
                }
                return res.status(200).json(json);
            }).catch((reject) => {
                json.data = { status: false };
                json.error = "Não foi possóvel carregar essa Questão!!";
                return res.status(200).json(json);
            })
        } catch (error) {
            json.data = { status: false };
            json.error = "Erro ao carregar Questão!!";
            return res.status(500).json(json);
        }
    } else {
        json.data = { status: false };
        json.error = "Nenhuma Questão foi selecioanda!!";
        return res.status(200).json(json);
    }

};


export const SelectQuestionByContent = async (req: Request, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object };
    let { id_content } = req.params;

    if (id_content) {
        try {
            await db.question.findMany({
                where: {
                    id_content: Number(id_content),
                },
                include: {
                    options: true,
                }
            }).then((response) => {
                if (response.length <= 0) {
                    json.data = { status: false };
                    json.error = "Nenhuma Questão encontrada!!";
                } else {
                    let data: any = response;
                    data.status = true;
                    json.data = data;
                }
                return res.status(200).json(json);
            }).catch((reject) => {
                json.data = { status: false };
                json.error = "Não foi possóvel carregar as Questões!!";
                return res.status(200).json(json);
            })
        } catch (error) {
            json.data = { status: false };
            json.error = "Erro ao carregar Questões!!";
            return res.status(500).json(json);
        }
    } else {
        json.data = { status: false };
        json.error = "Nenhuma Questão foi selecioanda!!";
        return res.status(200).json(json);
    }

}