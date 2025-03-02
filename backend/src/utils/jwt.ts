import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

//functions to generate the jwt token
export const generateToken = (payload:{userId:string, role:string}) =>{
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '6h' }); // here I have setuped the token will be expired after the 6 hours.
}

//functions to verify the jwt token
export const verifyToken = (token:string) =>{
    return jwt.verify(token, JWT_SECRET);
}
