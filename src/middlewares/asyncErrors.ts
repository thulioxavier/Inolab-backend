import { NextFunction, Request, Response } from "express";

export const AsyncErros = {
    error: async (error: Error, request: Request, response: Response, next: NextFunction) => {
        return response.json({
            status: 'Error',
            error: error.name,
            message: error.message
        });
    }
}