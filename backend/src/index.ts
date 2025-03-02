import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import router from './routes/authRoutes';



dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/user',router);

app.get('/', (req, res) => {
  res.send('Task Management System Backend');
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})