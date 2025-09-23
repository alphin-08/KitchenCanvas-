import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './uploadRecipe.css'; 
import '../AppLayout.css';

function UploadNewRecipe() {
    const [recipeName, setRecipeName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState('');
    const [message, setMessage] = useState(''); // Add this line
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
    const isGuest = localStorage.getItem('isGuest') === 'true';

    const handleUploadRecipe = async () => {
        if (!recipeName) {
            setMessage('Recipe Name is required.');
            return;
        }

        setIsUploading(true);
        setMessage(''); // Clear any previous messages

        if (isGuest) {
            const guestUploadedRecipes = JSON.parse(localStorage.getItem('guestUploadedRecipes')) || [];
            guestUploadedRecipes.push({
                id: Date.now(),
                name: recipeName,
                ingredients,
                steps,
            });
            localStorage.setItem('guestUploadedRecipes', JSON.stringify(guestUploadedRecipes));
            setMessage('Recipe uploaded successfully!'); // Show message on screen
        } else {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setMessage('You need to be logged in to upload a recipe.');
                setIsUploading(false);
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/uploadRecipe`, {
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
                    setMessage('Recipe uploaded successfully!');
                } else {
                    setMessage(data.error || 'Failed to upload recipe. Please try again.');
                }
            } catch (error) {
                console.error('Error uploading recipe:', error);
                setMessage('An unexpected error occurred. Please try again.');
            }
        }

        setIsUploading(false);
        setRecipeName('');
        setIngredients('');
        setSteps('');
    };

    return (
        <div className="main-container">
            <div className="uploadNewRecipe-container">
                <Link to="/homePage" className="home-link">
                    <h1>Kitchen Canvas</h1>
                </Link>
                <h2>Upload New Recipe</h2>
                <div className="form-container">
                    {message && <div className="upload-message">{message}</div>} {/* Show message here */}
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
                    <button className="uploadRecipeBt" onClick={handleUploadRecipe} disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Upload Recipe'}
                    </button>
                    <button className="uploadedRecipeBt" onClick={() => navigate('/uploadedRecipes')}>View Uploaded Recipes</button>
                    <button className="backfromUR" onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>
        </div>
    );
}

export default UploadNewRecipe;
