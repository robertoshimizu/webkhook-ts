"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let baseUri;
if (process.env.NODE_ENV === 'production') {
    baseUri = process.env.PRODUCTION_URL;
}
else {
    baseUri = process.env.DEVELOPMENT_URL;
}
console.log('baseUri:', baseUri);
// Create a new express application instance
const app = (0, express_1.default)();
// The port the express app will listen on
const port = (process.env.PORT != null) ? parseInt(process.env.PORT) : 3000;
// Support JSON payloads
app.use(express_1.default.json());
// Define a route handler for the default home page
app.get('/', (req, res) => {
    res.send('Hello, world of minecraft!');
});
// Define a webhook endpoint
app.post('/webhook', (req, res) => {
    console.log('Received webhook:', req.body);
    // Respond to the request indicating success
    res.status(200).send({ status: 'Received' });
});
// Start the Express server
app.listen(port, () => {
    console.log(`Server is running at ${baseUri}:${port}/`);
});
