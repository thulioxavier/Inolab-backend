import { NextFunction, Request, Response } from "express";
import { NewError } from "../errors/throwError";

export const Authorized = {
    access: async (request: Request, response: Response, next: NextFunction) => {
        
        if (request.headers.authorization)
            return next();

        return response.status(401).json( NewError.unauthorized(401, 'Not authorized'));
    }
}