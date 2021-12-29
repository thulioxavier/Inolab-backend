import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type ValuesCreate = {
    id_user: number,
    token: string,
}

export const TokenUserServices = {
    create: async (data: ValuesCreate) => {
       return await db.token_User.create({data})
    }
}