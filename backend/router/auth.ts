import { Router, Request, Response } from 'express';
import axios from 'axios';
import passport from 'passport';
import { Strategy as InstagramStrategy } from 'passport-instagram';
import dotenv from 'dotenv';
import path from 'path';
// import 'express-session';
// import '../types/session';

// Load the environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const INSTAGRAM_AUTH_URL = `https://api.instagram.com/oauth/authorize`;
const INSTAGRAM_TOKEN_URL = `https://api.instagram.com/oauth/access_token`;
const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || "" ;


const router = Router();

passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done: any) => {
  done(null, obj);
});
passport.use(new InstagramStrategy({
  clientID: CLIENT_ID || '',
  clientSecret: CLIENT_SECRET || '',
  callbackURL: REDIRECT_URI
  // i think it shld be server la but facebook disalow this
},
function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    
    // To keep the example simple, the user's Instagram profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the Instagram account with a user record in your database,
    // and return that user instead.
    return done(null, profile);
  });
}
));
   


router.get('/',  passport.authenticate('instagram',{ session: false }),

    (req, res) => {
      console.log('Instagram authentication route was called');
      // Continue with your response handling
      res.send('Authentication successful');
    }
),


router.get('/callback', 
    passport.authenticate('instagram', 
      { 
        
        // failureRedirect: '/login',
        session: false,
     }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect(`${REDIRECT_URI}/akcjadskjcadskfajkf`);
    }
  );
  

// Step 2: Handle the redirect and exchange the code for an access token
router.get('/redirect', async (req: Request, res: Response) => {
    const code = req.query.code as string;

    if (!code) {
        return res.status(400).send('Code is missing');
    }

    try {
        const response = await axios.post(INSTAGRAM_TOKEN_URL, {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
            code: code,
        });

        const { access_token } = response.data;

        // Store the access token in session
        // req.session.accessToken = access_token;

        // Redirect or respond to the user
        res.send('Instagram Authentication Successful');
    } catch (error) {
        console.error('Error during Instagram Authentication', error);
        res.status(500).send('Authentication Failed');
    }
});

export default router;