import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import useRouter from './routes/authRoutes';
import taskRouter from './routes/taskRoutes';
import passport from 'passport';
import session from 'express-session';
import './config/passport'; // Import the passport configuration

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'AkhilaC@01', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', useRouter);
app.use('/api/tasks', taskRouter);

app.get('/', (req, res) => {
  res.send('Task Management System Backend');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});