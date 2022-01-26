import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
    
    const user = await prisma.user.create({
        data:{
            email: 'thulioxavier@gmail.com',
            name: 'Thulio Xavier',
            password: '123123123',
            registration: '123456789456'
        }
    });
}

main();