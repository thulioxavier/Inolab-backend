import { Handler, NextFunction, Request, Response } from "express";

export const Adapter = {
    resolver: (handlerFn: Handler) => {
        return (request: Request, response: Response, next: NextFunction) => {
            return Promise.resolve(handlerFn(request, response, next))
                .catch((reject) => next(reject));
        }
    }
}