import { NextFunction, Request, Response } from "express";
import { NewError } from "../errors/throwError";

export const RequestError = {
    login: async (request: Request, response: Response, next: NextFunction) => {

        const {email, password} = request.body;

        if((email && password) && (typeof email === 'string' && typeof password === 'string'))
            return next();
        
        return response.status(400).json(NewError.invalidField(400, 'Invalid Field'));
    }
}