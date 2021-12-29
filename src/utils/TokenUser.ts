import crypto from 'crypto'

export const TokenUser = {
    newToken: async () => {
        return crypto.randomBytes(64).toString('hex');
    }
}