import { Request,Response,NextFunction } from "express";
import { verifyToken } from "../utils/jwt";


export const authMiddleware = (req: Request, res: Response, next:NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token){
        res.json({message:"No token,authorization denied"});
        return;
    }

    try{
        const decoded = verifyToken(token);
        (req as any).user = decoded; // Attach user data to the request object
        next(); // Continue to the next middleware or route handler
    }
    catch (err){
        res.json({message:"Token is not valid"});
    }
}