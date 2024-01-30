import { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('src/.env') })
import jwt from "jsonwebtoken";

interface ExtendedRequest extends Request {
    user?: any;
}
export const verifyJWT = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.header('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            error: 'Unauthorized - Missing token'
        });
    }
    console.log(token)
    jwt.verify(token,
        process.env.JWT_TOKEN as string,
        (err, user) => {
            if(err){
                return res.status(403).json({
                    error: 'Unauthorized - Invalid token'
                })
            }
            req.user = user
            next();
        });

};
