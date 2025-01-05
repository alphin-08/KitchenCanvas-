import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './database.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );
        res.json({ message: 'User registered successfully!', userId: result.insertId });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ error: 'An error occurred while registering the user.' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length > 0) {
            res.json({ message: 'Login successful!', user: rows[0] });
        } else {
            res.status(401).json({ error: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error('Error logging in user:', error.message);
        res.status(500).json({ error: 'An error occurred while logging in.' });
    }
});

app.post('/api/likedRecipes', async (req, res) => {
    const { userId, recipeId, recipeTitle, recipeImage } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO liked_recipes (user_id, recipe_id, recipe_title, recipe_image) VALUES (?, ?, ?, ?)',
            [userId, recipeId, recipeTitle, recipeImage]
        );
        res.json({ message: 'Recipe liked successfully!', likeId: result.insertId });
    } catch (error) {
        console.error('Error saving liked recipe:', error.message);
        res.status(500).json({ error: 'An error occurred while saving the liked recipe.' });
    }
});

// Get Liked Recipes for a User
app.get('/api/likedRecipes', async (req, res) => {
    const { userId } = req.query;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM liked_recipes WHERE user_id = ?',
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching liked recipes:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching liked recipes.' });
    }
});

app.get('/api/searchByIngredients', async (req, res) => {
    const ingredients = req.query.ingredients;
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${process.env.SPOONACULAR_API_KEY}`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

app.get('/api/recipeDetails', async (req, res) => {
    const { id } = req.query;
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`
        );
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        res.status(500).json({ error: 'Failed to fetch recipe details' });
    }
});

// Proxy route for Spoonacular API
app.get('/api/recipes', async (req, res) => {
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/random?number=12&apiKey=${process.env.SPOONACULAR_API_KEY}`
        );
        const data = await response.json();
        res.json(data); // Send the recipes back to the frontend
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

//Tryna to see if we reached max limit 
app.get('/api/debug', async (req, res) => {
    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/random?number=1&apiKey=${process.env.SPOONACULAR_API_KEY}`
        );
        const data = await response.json();
        res.json(data); // Send raw API response to debug
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Debugging failed' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

