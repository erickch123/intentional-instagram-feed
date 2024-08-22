import express from 'express';
import  auth  from './router/auth';

import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

app.use('/auth', auth);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});