import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";


export const registration = async (req: Request, res: Response) => {
    const {name, email, password, role } = req.body;

    try{
        //First we want to check, if the user is already registered
        const existingUser = await User.findOne({email});
        if(existingUser){
            res.status(400).json({message: "User already registered 😒😒"});
            return;
        }
        
        //Now we want to hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        //Now we Create a new User with the new hashed password
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user" //here we have set the default role as the 'user'
        })

        //Save the new User
        await newUser.save();

        //Send the Alert Message
        res.status(200).json({messege:"User Registration is Successfully 😃😍"})
    }
    catch(error){
        console.error(error);
        res.status(500).json({messege:"Server Error 😟😟" });
    }
}

export const login = async(req:Request, res:Response) =>{
    const {email , password, name} = req.body;


    try{
        //find the user by email
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({message: "ඔය email එකෙන් කවුරුත් register වෙලා නෑ නේ සුද්දෝ  😟😟"});
            return;
        }

        //comparing the password is correct or not
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({message: "Password එක වැරදි බන් හරි එක ගහපන් 🤬🤬😡"});
            return;
        }

        //Generate jwt token
        const token = generateToken({userId:user.id.toString(), role:user.role , name:user.name});

        //send the json to client
        res.json({token});
    }

    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
}

