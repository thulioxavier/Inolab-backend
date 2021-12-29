import bcrypt from 'bcryptjs';

export const CryptoPass = {
    newPass: async (password: string) => {
        const salt = bcrypt.genSaltSync(12);
        return bcrypt.hashSync(password, salt)
    }
}