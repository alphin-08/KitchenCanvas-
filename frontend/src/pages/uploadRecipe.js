import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './uploadRecipe.css'; // Create a CSS file for styling

function UploadNewRecipe() {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const navigate = useNavigate();
    const isGuest = localStorage.getItem('isGuest') === 'true';

    const handleUploadRecipe = async () => {
        if (!recipeName) {
            alert('Recipe Name is required.');
            return;
        }

        if (isGuest) {
            // Store recipes in localStorage for guests
            const guestUploadedRecipes = JSON.parse(localStorage.getItem('guestUploadedRecipes')) || [];
            guestUploadedRecipes.push({
                id: Date.now(), // Temporary ID for guest recipes
                name: recipeName,
                ingredients,
                steps,
            });
            localStorage.setItem('guestUploadedRecipes', JSON.stringify(guestUploadedRecipes));
            alert('Recipe uploaded successfully!');
        } else {
            // Store recipes in backend for logged-in users
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('You need to be logged in to upload a recipe.');
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/uploadRecipe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        recipeName,
                        ingredients,
                        steps,
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Recipe uploaded successfully!');
                } else {
                    alert(data.error || 'Failed to upload recipe. Please try again.');
                }
            } catch (error) {
                console.error('Error uploading recipe:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }

        // Reset form fields
        setRecipeName('');
        setIngredients('');
        setSteps('');
    };

    return (
        <div className="uploadNewRecipe-container">
            <Link to="/homePage" className="home-link">
                <h1>Kitchen Canvas</h1>
            </Link>
            <h2>Upload New Recipe</h2>
            <div className="form-container">
                <label>
                    Recipe Name:
                    <input
                        type="text"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                        placeholder="Enter recipe name"
                    />
                </label>
                <label>
                    Ingredients (comma-separated):
                    <textarea
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="Enter ingredients"
                    />
                </label>
                <label>
                    Steps:
                    <textarea
                        value={steps}
                        onChange={(e) => setSteps(e.target.value)}
                        placeholder="Enter steps to prepare the recipe"
                    />
                </label>
                <button className="uploadRecipeBt" onClick={handleUploadRecipe}>Upload Recipe</button>
                <button className="uploadedRecipeBt" onClick={() => navigate('/uploadedRecipes')}>View Uploaded Recipes</button>
                <button className="backfromUR" onClick={() => navigate(-1)}>Back</button>
            </div>
        </div>
    );
}

export default UploadNewRecipe;
