import express, { Request, Response } from 'express';
import User from '../model/User';
const router = express.Router();

// Example route to create a new user with followings
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               followings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     category:
 *                       type: array
 *                       items:
 *                         type: string
 *                     description:
 *                       type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '../model/User'
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Username already taken
 */

router.post('/register', async (req: Request, res: Response) => {
  const { name, username, followings } = req.body;

  console.log("req.bodyis", req.body)
  try {

    if (!name || !username || !followings) {
      return res.status(400).json({ statusCode: 400, message: 'Name, username, and followings are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ statusCode: 409, message: 'Username already taken' });
    }

    const user = new User({
      name,
      username,
      followings, // Add the followings array with category and description
    });

    await user.save();

    res.status(201).json({ statusCode: 201, message: 'User registered successfully', data: user });
  } catch (error) {
    console.log(error)
    res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });

  }
});

// Update user endpoint

// PATCH route to update user partially
/**
 * @swagger
 * /users/{username}:
 *   patch:
 *     summary: Update user partially
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               followings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     category:
 *                       type: array
 *                       items:
 *                         type: string
 *                     description:
 *                       type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '../model/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 */
router.patch('/:username', async (req: Request, res: Response) => {
  const username = req.params.username;
  const updates = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }

    // Apply partial updates
    if (updates.followings) {
      // Update the followings array
      const updatedFollowings = user.followings.map(following => {
        const updated = updates.followings.find((u: { username: string; }) => u.username === following.username);
        return updated ? { ...following, ...updated } : following;
      });

      // Add any new followings that aren't in the current list
      const newFollowings = updates.followings.filter((u: { username: string; }) => !user.followings.find(f => f.username === u.username));
      user.followings = [...updatedFollowings, ...newFollowings];
    }

    // Apply other updates
    Object.keys(updates).forEach(key => {
      if (key !== 'followings' && Object.prototype.hasOwnProperty.call(user, key)) {
        (user as any)[key] = updates[key];
      }
    });

    // Save the updated user
    await user.save();
    res.status(200).json({ statusCode: 200, message: 'User updated successfully', data: user });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ statusCode: 500, message: 'Server error' });
  }
});

/**
 * @swagger
 * /users/{username}:
 *   get:
 *     summary: Get a user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */

router.get('/:username', async (req: Request, res: Response) => {
  try {
      const username = req.params.username;
      const user = await User.findOne({ username });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users excluding their followings
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '../model/User'
 */
router.get('/', async (req: Request, res: Response, ) => {
  try {
      const users = await User.find({}, '-followings').lean(); // Use lean() to convert Mongoose documents to plain objects
      res.status(200).json({ statusCode: 200, message: 'Users retrieved successfully', data: users });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error' });
  }
});
export default router;