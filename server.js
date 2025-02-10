import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import studentRouter from './routes/students.js';
import subjectRouter from './routes/subjects.js';
import examRouter from './routes/exams.js';
import resultRouter from './routes/results.js';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/students', studentRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/exams', examRouter);
app.use('/api/results', resultRouter);
app.use('/auth', authRouter);
connectDB();
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server Running on port: ${process.env.PORT}`);
});
