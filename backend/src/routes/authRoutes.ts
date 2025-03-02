import express from 'express';
import { login, registration } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

//For Registration part, we need to use POST method.
router.post('/register',registration);

//For the Loging part we need to use Get method.
router.post('/login', login);

//protected router
router.get('/profile', authMiddleware, (req, res) => {
    res.json({message:"Welcome to your Profile 🤓🤓🤓 ", user:(req as any).user});
});


export default router;