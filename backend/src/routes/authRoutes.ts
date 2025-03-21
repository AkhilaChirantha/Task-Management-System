import express from 'express';
import passport from 'passport';
import { getUsers, login, registration, getProfile } from '../controllers/authController'; // Import getProfile
import { authMiddleware } from '../middleware/authMiddleware';
import { generateToken } from '../utils/jwt';

const useRouter = express.Router();

// Manual Authentication
useRouter.post('/register', registration);
useRouter.post('/login', login);

// Protected Route to fetch user profile
useRouter.get('/profile', authMiddleware, getProfile); // Use getProfile here

// Fetch all users (protected route)
useRouter.get('/', authMiddleware, getUsers);

// Google OAuth Routes
useRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

useRouter.get('/auth/google/callback', (req, res, next) => {
  console.log('Google OAuth callback received...');
  passport.authenticate('google', { failureRedirect: '/login' })(req, res, next);
}, (req, res) => {
  console.log('Google OAuth successful!');
  // Generate a JWT token
  const token = generateToken({ userId: (req.user as any)._id, role: (req.user as any).role, name: (req.user as any).name });

  // Redirect to the frontend profile page with the token
  res.redirect(`http://localhost:5173/profile?token=${token}`);
});

export default useRouter;