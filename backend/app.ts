import express from 'express';
import  auth  from './router/auth';
import user from './router/user';
import connectDB from './db';
import dotenv from 'dotenv';
import path from 'path';

import passport from 'passport';

// Load the environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
connectDB()

// Middleware
app.use(express.json());
app.use(passport.initialize());

const PORT = process.env.PORT ;
app.use(express.urlencoded({ extended: true }));
app.use('/auth', auth);
app.use('/user',user);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
});