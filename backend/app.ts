import express from 'express';
import  auth  from './router/auth';
import user from './router/user';
import connectDB from './db';
import dotenv from 'dotenv';
import path from 'path';
import passport from 'passport';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import {swaggerOptions} from './swagger';


// Load the environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const swaggerDocs = swaggerJsdoc(swaggerOptions);

const app = express();
connectDB()

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const PORT = process.env.PORT ;
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/auth', auth);
app.use('/users',user);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
});