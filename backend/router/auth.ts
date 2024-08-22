import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// Step 1: Redirect user to Instagram's OAuth 2.0 server
router.get('/login', (req: Request, res: Response) => {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;

    res.redirect(instagramAuthUrl);
});

// Step 2: Handle the redirect and exchange the code for an access token
router.get('/redirect', async (req: Request, res: Response) => {
    const code = req.query.code as string;

    if (!code) {
        return res.status(400).send('Code is missing');
    }

    try {
        const response = await axios.post('https://api.instagram.com/oauth/access_token', {
            client_id: process.env.INSTAGRAM_CLIENT_ID,
            client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
            code,
        });

        const { access_token, user_id } = response.data;

        // Step 3: Use the access token to get user info
        const userResponse = await axios.get(`https://graph.instagram.com/${user_id}?fields=id,username&access_token=${access_token}`);

        res.json(userResponse.data);
    } catch (error) {
        console.error('Error getting access token:', error);
        res.status(500).send('Error during authentication');
    }
});

export default router;