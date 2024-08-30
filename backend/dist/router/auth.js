"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePassport = configurePassport;
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const passport_1 = __importDefault(require("passport"));
const passport_instagram_1 = require("passport-instagram");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// import 'express-session';
// import '../types/session';
// Load the environment variables
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '.env') });
const INSTAGRAM_AUTH_URL = `https://api.instagram.com/oauth/authorize`;
const INSTAGRAM_TOKEN_URL = `https://api.instagram.com/oauth/access_token`;
const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI || "";
const router = (0, express_1.Router)();
function configurePassport() {
    passport_1.default.use(new passport_instagram_1.Strategy({
        clientID: CLIENT_ID || '',
        clientSecret: CLIENT_SECRET || '',
        callbackURL: '/callback'
    }, (accessToken, refreshToken, profile, cb) => {
        // Here you would typically save the user to your database
        // For this example, we'll just pass the profile to the next middleware
        cb(null, {
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    }));
    passport_1.default.serializeUser((user, done) => {
        done(null, user);
    });
    passport_1.default.deserializeUser((obj, done) => {
        done(null, obj);
    });
}
// Step 1: Redirect user to Instagram's OAuth 2.0 server
configurePassport();
router.get('/', passport_1.default.authenticate('instagram', { session: false })),
    router.get('/callback', passport_1.default.authenticate('instagram', {
        // failureRedirect: '/login',
        session: false,
    }), (req, res) => {
        // Successful authentication, redirect home.
        res.redirect(`${REDIRECT_URI}/akcjadskjcadskfajkf`);
    });
// Step 2: Handle the redirect and exchange the code for an access token
router.get('/redirect', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send('Code is missing');
    }
    try {
        const response = yield axios_1.default.post(INSTAGRAM_TOKEN_URL, {
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
    }
    catch (error) {
        console.error('Error during Instagram Authentication', error);
        res.status(500).send('Authentication Failed');
    }
}));
exports.default = router;
