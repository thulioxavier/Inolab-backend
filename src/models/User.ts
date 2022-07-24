import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import JWT from "jsonwebtoken";

const db = new PrismaClient();

export const User = {
    login: async (data: { email: string, password: string }) => {

        try {
            const user = await db.user.findUnique({
                where: {
                    email: data.email,
                }
            });

            if (user) {
                const match = await bcrypt.compareSync(data.password, user.password)

                if (match) {
                    const TOKEN = JWT.sign({

                    },
                        process.env.JWT_SECRET_KEY as string,
                    );

                    return {
                        TOKEN,
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    findOne: async (values: { id: number }) => {
        try {

            const user = await db.user.findUnique({
                where: { id: Number(values.id) },
                select: {
                    password: false,
                    id: true,
                    email: true,
                    name: true,
                    uuid: true,
                    registration: true,
                    avatar: true,
                    status: true,
                    last_name: true,
                }
            });

            return user;

        } catch (error) {
            console.error(error);
            throw new Error("Tente novamente mais tarde!");
        }
    }
}