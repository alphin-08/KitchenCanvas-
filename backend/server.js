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


// Proxy route for Spoonacular API
app.get('/api/recipes', async (req, res) => {
    try {
        console.log("Fetching recipes from Spoonacular API...");
        const response = await fetch(
            `https://api.spoonacular.com/recipes/random?number=9&apiKey=${process.env.SPOONACULAR_API_KEY}`
        );
        const data = await response.json();
        res.json(data); // Send the recipes back to the frontend
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

