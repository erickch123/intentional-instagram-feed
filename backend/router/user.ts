import express, { Request, Response } from 'express';
import User from '../model/User';
import mongoose from 'mongoose';
import Category, { ICategory } from '../model/Category';

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
 *               instagramUserID:
 *                 type: string
 *               fullName:
 *                 type: string
 *               username:
 *                 type: string
 *               followings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     instagramUserID:
 *                       type: string
 *                     username:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     categories:
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
  const { instagramUserID, fullName, username, followings } = req.body;

  console.log("req.body is", req.body);
  try {
    if (!instagramUserID || !username || !Array.isArray(followings)) {
      return res.status(400).json({ statusCode: 400, message: 'Instagram User ID, username, and followings are required' });
    }

    const existingUser = await User.findOne({ instagramUserID });
    if (existingUser) {
      return res.status(409).json({ statusCode: 409, message: 'Instagram user id is already taken' });
    }

    const user = new User({
      instagramUserID,
      fullName,
      username,
      followings, // Add the followings array with instagramUserID, username, fullName, categories, and description
      categories: [], // Initialize categories as an empty array
      
    });

    await user.save();

    res.status(201).json({ statusCode: 201, message: 'User registered successfully', data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ statusCode: 500, message: 'Internal Server Error' });
  }
});
// DELETE /users/:id - Delete a user by ID
/**
 * @swagger
 * /users/{instagramUserID}:
 *   delete:
 *     summary: Delete a user by instagramUserID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: instagramUserID
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's Instagram User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 error:
 *                   type: object
 */
router.delete('/:instagramUserID', async (req: Request, res: Response) => {
  try {
    const instagramUserID = req.params.instagramUserID;
    const user = await User.findOneAndDelete({ instagramUserID });

    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }

    res.status(200).json({ statusCode: 200, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: 'Internal server error', error });
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
*               fullName:
 *                 type: string
 *               instagramUserID:
 *                 type: string
 *               username:
 *                 type: string
 *               followings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     instagramUserID:
 *                       type: string
 *                     username:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     categories:
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
    const user = await User.findOne({ username })
    
    
    ;

    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }

     // Apply partial updates
     if (updates.fullName) {
      user.fullName = updates.fullName;
    }

    if (updates.instagramUserID) {
      user.instagramUserID = updates.instagramUserID;
    }

    if (updates.username) {
      user.username = updates.username;
    }


    // Apply partial updates
    // Maybe use other ENDPOINT  /users/followings/:username FOR SMOOTHER AND CLEANER CODE
    // It is here but dont think will work
    // if (updates.followings) {
    //   // Update the followings array
    //   const updatedFollowings = user.followings.map(following => {
    //     const updated = updates.followings.find((u: { username: string; }) => u.username === following.username);
    //     return updated ? { ...following, ...updated } : following;
    //   });

    //   // Add any new followings that aren't in the current list
    //   const newFollowings = updates.followings.filter((u: { username: string; }) => !user.followings.find(f => f.username === u.username));
    //   user.followings = [...updatedFollowings, ...newFollowings];
    // }

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
 *                   $ref: '../model/User'
 *       404:
 *         description: User not found
 */

router.get('/:username', async (req: Request, res: Response) => {
  try {
      const username = req.params.username;
      const user = await User.findOne({ username })
      .populate('categories', 'name') // Populate user categories
      .populate('followings.categories', 'name'); // Populate followings categories
      ;

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


/**
 * @swagger
 * /users/categories/{username}:
 *   patch:
 *     summary: Add a category to a user
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
 *               categoryName:
 *                 type: string
 *                 description: The category to add
 *     responses:
 *       200:
 *         description: Category added successfully
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal Server Error
 */
router.patch('/categories/:username/', async (req: Request, res: Response) => {
  const username = req.params.username;
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ statusCode: 400, message: 'Category name is required' });
  }
  try {
  
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }

    let category: ICategory | null = await Category.findOne({ name: categoryName });

    // If category doesn't exist, create it
    if (!category) {
      category = new Category({ name: categoryName });
      await category.save();
    }

    // Check if the category is already associated with the user
    
// Check if the category is already associated with the user
if (user.categories.some((cat) => cat.name === category.name)) {
  return res.status(400).json({ statusCode: 400, message: 'Category already exists' });
}

// Add the category object to the user's categories
user.categories.push(category);
await user.save();

    await user.save();

    return res.status(200).json({
      statusCode: 200,
      message: 'Category added successfully',
      data: {
        id: category._id,
        name: category.name,
      },
    });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ statusCode: 500, message: 'Server error' });
  }
});

// New endpoint to add categories to FollowingSchema
/**
 * @swagger
 * /users/followings/{username}/{followingUsername}/{categoryName}:
 *   patch:
 *     summary: Add a category to a following if it exists in user's categories
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user
 *       - in: path
 *         name: followingUsername
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the following
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the category
 *     responses:
 *       200:
 *         description: Category added to following successfully
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
 *         description: Category must exist in user categories or invalid input
 *       404:
 *         description: User or following not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/followings/:username/:followingUsername/:categoryName', async (req: Request, res: Response) => {
  const { username, followingUsername, categoryName } = req.params;

  try {
    const user = await User.findOne({ username })
    .populate('categories', 'name') // Populate user categories
    .populate('followings.categories', 'name'); // Populate followings categories

    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }

    const following = user.followings.find(f => f.username === followingUsername);

    if (!following) {
      return res.status(404).json({ statusCode: 404, message: 'Following not found' });
    }

    const category = user.categories.find(cat => cat.name === categoryName);
    if (!category) {
      return res.status(404).json({ statusCode: 404, message: `Category not found ${user.categories}`});
    }

    // Check if the category ID is already associated with the following
    // if (following.categories.some((cat: any) => cat._id.equals(category._id) || cat.name === category.name)) {
    //   return res.status(400).json({ statusCode: 400, message: 'Category already exists in following' });
    // }

     // Check if the category ID or name is already associated with the following
     if (following.categories.some((cat: any) => cat._id.equals(category._id) || cat.name === category.name)) {
      return res.status(400).json({ statusCode: 400, message: `Category already exists in following ${category}` });
    }

    // Add the category ID to the following's categories
    following.categories.push(category._id as mongoose.Types.ObjectId);

    await user.save();

    res.status(200).json({ statusCode: 200, message: `Category added to following successfully`, data: category });
  } catch (err) {
    console.error('Error adding category to following:', err);
    res.status(500).json({ statusCode: 500, message: 'Server error' });
  }
});


// Delete a category from a user's categories
/**
 * @swagger
 * /users/categories/{username}:
 *   delete:
 *     summary: Delete a category from a user's categories
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
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
 *         description: User or category not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/categories/:username', async (req: Request, res: Response) => {
  const username = req.params.username;
  const { category } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }

    const categoryIndex = user.categories.indexOf(category);
    if (categoryIndex === -1) {
      return res.status(404).json({ statusCode: 404, message: 'Category not found' });
    }

    user.categories.splice(categoryIndex, 1);
    await user.save();

    res.status(200).json({ statusCode: 200, message: 'Category deleted successfully', data: user });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ statusCode: 500, message: 'Server error' });
  }
});

// Rename a category
/**
 * @swagger
 * /users/categories/{username}/rename:
 *   patch:
 *     summary: Rename a category
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldCategory:
 *                 type: string
 *                 description: The current name of the category
 *               newCategory:
 *                 type: string
 *                 description: The new name of the category
 *     responses:
 *       200:
 *         description: Category renamed successfully
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *       404:
 *         description: User or category not found
 *       500:
 *         description: Internal Server Error
 */
router.patch('/categories/:username/rename', async (req: Request, res: Response) => {
  const username = req.params.username;
  const { oldCategory, newCategory } = req.body;

  try {
    const user = await User.findOne({ username })
    .populate('categories', 'name') ;  

    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }

    const category = user.categories.find(cat => cat.name === oldCategory);
    if (!category) {
      return res.status(404).json({ statusCode: 404, message: `Category not found` });
    }
    console.log(category)
    category.name = newCategory;

    await Category.findByIdAndUpdate(category._id, { name: newCategory });

    res.status(200).json({ statusCode: 200, message: 'Category renamed successfully', data: { id: category._id, name: newCategory } });
  } catch (error) {
    console.error('Error renaming category:', error);
    res.status(500).json({ statusCode: 500, message: 'Server error' });
  }
});




export default router;
