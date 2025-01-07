import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './uploadRecipe.css'; // Create a CSS file for styling

function UploadNewRecipe() {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const navigate = useNavigate();

    const handleUploadRecipe = async () => {
        // Prepare the data to be sent to the backend
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
                setRecipeName('');
                setIngredients('');
                setSteps('');
            } else {
                alert(data.error || 'Failed to upload recipe. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading recipe:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="uploadNewRecipe-container">
            <h1>Upload New Recipe</h1>
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

                <button className = "uploadRecipeBt" onClick={handleUploadRecipe}>Upload Recipe</button>
                <button className = "uploadedRecipeBt" onClick={() => navigate('/uploadedRecipes')}>View Uploaded Recipes</button>

                <button className = "backfromUR" onClick={() => navigate(-1)}>Back</button>

            </div>
        </div>
    );
}

export default UploadNewRecipe;