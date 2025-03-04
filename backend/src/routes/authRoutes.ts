import express from 'express';
import {  getUsers, login, registration } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const useRouter = express.Router();

//For Registration part, we need to use POST method.
useRouter.post('/register',registration);

//For the Loging part we need to use Get method.
useRouter.post('/login', login);

//protected router
useRouter.get('/profile', authMiddleware, (req, res) => {
    res.json({message:"Welcome to your Profile 🤓🤓🤓 ", user:(req as any).user});
});

useRouter.get('/', authMiddleware, getUsers);


export default useRouter;