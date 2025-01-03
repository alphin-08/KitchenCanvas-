import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
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

