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
  id_content: number
}

interface ArrayData {
  body: string;
  correct: boolean;
  id_question: number;
}

export const CreateQuestion = async (req: Request, res: Response) => {
  let json: JsonResponse = { data: Object, error: Object };


  try {
    let { time, body, difficulty, question_array, id_content }: Body = req.body;

    let idQuestion: any = null;

    if (body && difficulty >=0 && id_content) {
      if (question_array.length > 0) {
        const arrayData: any = [];
        await db.question
          .create({
            data: {
              time,
              body,
              difficulty,
              id_content: Number(id_content),
            },
          })
          .then(async (response) => {
            idQuestion = response.id as number;

            question_array.map((item) => {
              let dataItem: any = item;
              dataItem.id_question = response.id;
              arrayData.push(dataItem);
            });

            await db.option
              .createMany({
                data: arrayData,
              })
              .then(async (response) => {
                json.data = {
                  id_question: idQuestion,
                  options: response,
                  status: true,
                };

                return res.status(200).json(json);
              })
              .catch(async (reject) => {
                await db.question.delete({
                  where: {
                    id: idQuestion,
                  },
                });

                json.data = { status: false };
                json.error = "Houve uma falha ao cadastrar as Alternativas!";
                return res.status(500).json(json);
              });
          })
          .catch(async (reject) => {
            json.data = { status: false };
            json.error = "Houve uma falha ao cadastrar a Quest??o!";
            return res.status(500).json(json);
          });

      } else {
        json.data = { status: false };
        json.error = "N??o ?? poss??vel criar uma Quest??o sem alternativas!!";
        return res.status(500).json(json);
      }
    } else {
      json.data = { status: false };
      json.error = "Alguns campos n??o foram preenchidos!";
      return res.status(500).json(json);
    }
  } catch (error) {
    json.data = { status: false };
    json.error = "N??o foi poss??vel criar uma nova quest??o no momento!!";
    return res.status(500).json(json);
  }
};

export const questionsCount = async (req: Request, res: Response) => {
    
  try {
      const questions = await db.question.count();

      res.status(200).json({
          data: {
              success: true,
              questions: {
                  count: questions
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
            json.error = "Nenhuma Quest??o encontrada!!";
          } else {
            let data: any = response;
            data.status = true;
            json.data = data;
          }
          return res.status(200).json(json);
        })
        .catch((reject) => {
          json.data = { status: false };
          json.error = "N??o foi poss??vel carregar essa Quest??o!!";
          return res.status(200).json(json);
        });
    } catch (error) {
      json.data = { status: false };
      json.error = "Erro ao carregar Quest??o!!";
      return res.status(500).json(json);
    }
  } else {
    json.data = { status: false };
    json.error = "Nenhuma Quest??o foi selecioanda!!";
    return res.status(200).json(json);
  }
};

export const SelectQuestionByContent = async (req: Request, res: Response) => {
  let json: JsonResponse = { data: Object, error: Object };
  let { id_content } = req.params;

  if (id_content) {
    try {
      await db.question
        .findMany({
          where: {
            id_content: Number(id_content),
          },
          include: {
            options: true,
          },
        })
        .then((response) => {
          if (response.length <= 0) {
            json.data = { status: false };
            json.error = "Nenhuma Quest??o encontrada!!";
            return res.status(200).json(json);
          } else {
            let data: any = response;
            data.status = true;
            json.data = data;
            return res.status(200).json(json);
          }
        })
        .catch((reject) => {
          json.data = { status: false };
          json.error = "N??o foi poss??vel carregar as Quest??es!!";
          return res.status(200).json(json);
        });
    } catch (error) {
      json.data = { status: false };
      json.error = "Erro ao carregar Quest??es!!";
      return res.status(500).json(json);
    }
  } else {
    json.data = { status: false };
    json.error = "Nenhuma Quest??o foi selecioanda!!";
    return res.status(200).json(json);
  }
};
