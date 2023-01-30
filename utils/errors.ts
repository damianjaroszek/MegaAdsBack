import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {
}

export const handleError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    res
        .status(err instanceof ValidationError ? 400 : 500) // 400 - błędne dane od usera; 500 - wewnętrzny błąd serwera
        .json({
            message: err instanceof ValidationError ? err.message : 'Sorry, please try again later', // zwracaj tylko komunikaty błędów ValidationError, jeżeli są klasy Error to napisz te komunikaty informacją 'Sorry, please try again later'
        })
}
