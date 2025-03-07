import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

//functions to generate the jwt token
export const generateToken = (payload:{userId:string, role:string, name:string}) =>{
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // here I have setuped the token will be expired after the 1 hours.
}

//functions to verify the jwt token
export const verifyToken = (token:string) =>{
    return jwt.verify(token, JWT_SECRET);
}
