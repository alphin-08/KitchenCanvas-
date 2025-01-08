import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './uploadedRecipes.css';

function UploadedRecipes() {
    const [uploadedRecipes, setUploadedRecipes] = useState([]);
    const navigate = useNavigate();
    const isGuest = localStorage.getItem('isGuest') === 'true';

    useEffect(() => {
        if (isGuest) {
            // Fetch recipes from localStorage for guests
            const guestUploadedRecipes = JSON.parse(localStorage.getItem('guestUploadedRecipes')) || [];
            setUploadedRecipes(guestUploadedRecipes);
        } else {
            // Fetch recipes from backend for logged-in users
            const fetchUploadedRecipes = async () => {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    alert('You need to be logged in to view your uploaded recipes.');
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:5000/api/uploadedRecipes?userId=${userId}`);
                    const data = await response.json();
                    if (response.ok) {
                        setUploadedRecipes(data);
                    } else {
                        alert(data.error || 'Failed to fetch uploaded recipes.');
                    }
                } catch (error) {
                    console.error('Error fetching uploaded recipes:', error);
                    alert('An error occurred. Please try again.');
                }
            };

            fetchUploadedRecipes();
        }
    }, [isGuest]);

    const handleDeleteRecipe = (recipeId) => {
        if (isGuest) {
            // Delete recipe for guest users
            const guestUploadedRecipes = JSON.parse(localStorage.getItem('guestUploadedRecipes')) || [];
            const updatedRecipes = guestUploadedRecipes.filter((recipe) => recipe.id !== recipeId);
            localStorage.setItem('guestUploadedRecipes', JSON.stringify(updatedRecipes));
            setUploadedRecipes(updatedRecipes);
        } else {
            // Delete recipe for logged-in users
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('You need to be logged in to delete a recipe.');
                return;
            }

            fetch('http://localhost:5000/api/deleteUploadedRecipe', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, recipeId }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message) {
                        setUploadedRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
                    } else {
                        alert(data.error || 'Failed to delete recipe.');
                    }
                })
                .catch((error) => console.error('Error deleting recipe:', error));
        }
    };

    return (
        <div className="uploadedRecipes-container">
            <Link to="/homePage" className="home-link">
                <h1>Kitchen Canvas</h1>
            </Link>
            <h2>Your Uploaded Recipes</h2>
            {uploadedRecipes.length > 0 ? (
                <div className="recipe-list3">
                    {uploadedRecipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card3">
                            <h2>{recipe.name}</h2>
                            <p><b>Ingredients:</b> {recipe.ingredients}</p>
                            <p><b>Steps:</b> {recipe.steps}</p>
                            <button className="remove-button" onClick={() => handleDeleteRecipe(recipe.id)}>X</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No recipes uploaded yet.</p>
            )}
            <button className="backfromUploadedR" onClick={() => navigate(-1)}>Back</button>
        </div>
    );
}

export default UploadedRecipes;
