import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type ValuesCreate = {
    email: string,
    name: string,
    password: string,
    registration: string,
    last_name: string,
}

export const UserServices = {

    userByEmail: async (email: string) => {
        return await db.user.count({ where: { email: email } });
    },

    create: async (data: ValuesCreate) => {
        return await db.user.create({ data })
    }

}