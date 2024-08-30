"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./router/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
// Load the environment variables
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '.env') });
const app = (0, express_1.default)();
// Middleware
app.use(passport_1.default.initialize());
const PORT = process.env.PORT;
app.use('/auth', auth_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
