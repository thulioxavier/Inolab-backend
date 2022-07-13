import { Request, response, Response } from "express";

import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

interface JsonResponse {
  data: Object | Array<object>;
  error: Object | string;
}

interface Body {
  time: number;
  body: string;
  difficulty: number;
  title: string;
  question_array: Array<object>;
}

interface ArrayData {
  body: string;
  correct: boolean;
  id_question: number;
}



export const SelectQuestionById = async (req: Request, res: Response) => {
  let json: JsonResponse = { data: Object, error: Object };
  let { id_question } = req.params;

  if (id_question) {
    try {
      await db.question
        .findMany({
          where: {
            id: Number(id_question),
          },
          include: {
            options: true,
          },
        })
        .then((response) => {
          if (response.length <= 0) {
            json.data = { status: false };
            json.error = "Nenhuma Questão encontrada!!";
          } else {
            let data: any = response;
            data.status = true;
            json.data = data;
          }
          return res.status(200).json(json);
        })
        .catch((reject) => {
          json.data = { status: false };
          json.error = "Não foi possóvel carregar essa Questão!!";
          return res.status(200).json(json);
        });
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
  let { id_content, id_user} = req.params;

  if (id_content) {
    try {
      await db.question
        .findMany({
          where: {
            id_content: Number(id_content),
          },
          include: {
            options: {
              include:{
                answers: {
                  select:{
                    createdAt: false,
                    answer_date: false,
                    id: true,
                    id_option: false,
                    id_question: false,
                    id_user: false,
                    options: false,
                    points: true,
                    questions: false,
                    status: true,
                    time_spent: false,
                    updatedAt: false,
                    users: false,
                  },
                  where: {
                    id_user: Number(id_user),
                  }
                }
              }
            },
          },
        })
        .then((response) => {
          if (response.length <= 0) {
            json.data = { status: false };
            json.error = "Nenhuma Questão encontrada!!";
            return res.status(200).json(json);

          } else {
            let data: any = response;
            json.data = {status: true, data};
            return res.status(200).json(json);
          }
        })
        .catch((reject) => {
          json.data = { status: false };
          json.error = "Não foi possóvel carregar as Questões!!";
          return res.status(200).json(json);
        });
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
};
