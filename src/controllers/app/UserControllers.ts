import { Request, Response } from 'express';
import { Error } from '../../errors/Erros';
import { UserServices } from '../../services';
import { TokenUserServices } from '../../services/TokenUserServices';
import { CryptoPass } from '../../utils/PasswordCript';
import { TokenUser } from '../../utils/TokenUser';

type PersoneModel = {
    email: string,
    name: string,
    password: string
}

interface JsonResponse {
    data: Object,
    error: Object | string,
}

export const CreateUser = async (req: Request<PersoneModel>, res: Response) => {
    let json: JsonResponse = { data: Object, error: Object };
    const { email, name, password } = req.body;

    try {

        if (await UserServices.userByEmail(email) <= 0) {
            await UserServices.create({
                email,
                name,
                password: await CryptoPass.newPass(password)
            }).then(async (resultUser) => {

                await TokenUserServices.create({
                    id_user: Number(resultUser?.id),
                    token: await TokenUser.newToken(),
                }).then((resultToken) => {
                    json.data = { resultToken, resultUser };
                    return res.status(200).json(json);
                }).catch(async (reject) => {
                    const e = await Error.SelectError(reject.code);
                    reject.msg = e;
                    json.error = { reject };
                    return res.status(500).json(json);
                });

            }).catch(async (reject) => {
                const e = await Error.SelectError(reject.code);
                reject.msg = e;
                json.error = { reject };
                return res.status(500).json(json);
            });
        } else {
            json.error = 'Esse E-mail já esté em uso por outro usuário!';
            return res.status(200).json(json);
        }
    } catch (error) {
        json.error = { error };
        return res.status(500).send(json.error);
    }
}
