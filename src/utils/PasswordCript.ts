import bcrypt from 'bcryptjs';

export const CryptoPass = {
    newPass: async (password: string) => {
        const salt = bcrypt.genSaltSync(12);
        return bcrypt.hashSync(password, salt)
    },

    newToken: async (): Promise<string> =>{
        let payload = (Date.now()+ Math.random()).toString();
        return bcrypt.hashSync(payload, 10);
    },

    matchPassword: async (password: string, hash: string): Promise<boolean> => {
        const authorized = await bcrypt.compareSync(password, hash);
        return authorized;
    } 
}