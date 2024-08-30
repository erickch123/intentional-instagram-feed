import express, { Request, Response } from 'express';
import User from '../model/User';
import dotenv from 'dotenv';
// import path from 'path';

// // Load environment variables from .env file
// dotenv.config({ path: path.join(__dirname, '..', '.env') });
const router = express.Router();

// Example route to create a new user with followings
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password, followings } = req.body;

  console.log("req.bodyis", req.body)
  try {
    const user = new User({
      name,
      email,
      password,
      followings, // Add the followings array with category and description
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;