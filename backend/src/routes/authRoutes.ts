import express from 'express';
import passport from 'passport';
import { getUsers, login, registration } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const useRouter = express.Router();

// Manual Authentication
useRouter.post('/register', registration);
useRouter.post('/login', login);

// Protected Route
useRouter.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: "Welcome to your Profile 🤓🤓🤓 ", user: (req as any).user });
});

useRouter.get('/', authMiddleware, getUsers);

// Google OAuth Routes
useRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  
  useRouter.get('/auth/google/callback', (req, res, next) => {
    console.log('Google OAuth callback received...');
    passport.authenticate('google', { failureRedirect: '/login' })(req, res, next);
  }, (req, res) => {
    console.log('Google OAuth successful!');
    res.redirect('/');
  });

export default useRouter;