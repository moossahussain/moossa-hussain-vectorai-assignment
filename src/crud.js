
// Import necessary modules
const express = require('express');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json());

// Environment variables
const DATABASE_ENDPOINT = process.env.DATABASE_ENDPOINT;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const SECRET_KEY = "your_secret_key";
const ALGORITHM = "HS256";

// MongoDB connection URI
const MONGO_URI = `mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_ENDPOINT}:27017/?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;

// Initialize MongoDB client
const client = new MongoClient(MONGO_URI);
let userCollection;

async function initDb() {
    try {
        await client.connect();
        const db = client.db('user_db');
        userCollection = db.collection('users');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

initDb();

// Helper functions
async function getUser(username) {
    return await userCollection.findOne({ username });
}

function verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
}

function getPasswordHash(password) {
    return bcrypt.hashSync(password, 10);
}

function createAccessToken(data) {
    return jwt.sign(data, SECRET_KEY, { algorithm: ALGORITHM, expiresIn: '30m' });
}

function decodeAccessToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

// Tester code
exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello from the CRUD Lambda Function!',
        }),
    };
};

// Routes
app.post('/auth/register', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await getUser(username);

    if (existingUser) {
        return res.status(400).json({ detail: 'User already exists' });
    }

    const hashedPassword = getPasswordHash(password);
    await userCollection.insertOne({ username, hashed_password: hashedPassword });

    res.json({ msg: 'User registered successfully' });
});

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await getUser(username);

    if (!user || !verifyPassword(password, user.hashed_password)) {
        return res.status(401).json({ detail: 'Invalid credentials' });
    }

    const token = createAccessToken({ sub: username });
    res.json({ access_token: token, token_type: 'bearer' });
});

app.get('/users/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ detail: 'Token required' });
    }

    try {
        const payload = decodeAccessToken(token);
        res.json({ username: payload.sub });
    } catch (error) {
        res.status(401).json({ detail: 'Invalid token' });
    }
});

app.delete('/users/:id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ detail: 'Token required' });
    }

    try {
        const payload = decodeAccessToken(token);
        const { id } = req.params;

        if (payload.sub !== id) {
            return res.status(401).json({ detail: 'Unauthorized action' });
        }

        await userCollection.deleteOne({ username: id });
        res.json({ msg: 'User deleted successfully' });
    } catch (error) {
        res.status(401).json({ detail: 'Invalid token' });
    }
});

// AWS Lambda handler
const serverless = require('serverless-http');
module.exports.handler = serverless(app);
