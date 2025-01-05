import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './recipeDetails.css';

function RecipeDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { recipe } = location.state;
    const [showDetails, setShowDetails] = useState(false);

    const handleShowRecipe = () => {
        setShowDetails(!showDetails);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleLikeRecipe = async () => {
        // Need to replace this const with actual logged-in userId
        const userId = 1;

        try {
            const response = await fetch('http://localhost:5000/api/likedRecipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    recipeId: recipe.id,
                    recipeTitle: recipe.title,
                    recipeImage: recipe.image,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Recipe liked successfully!');
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error liking recipe:', error);
            alert('An error occurred while liking the recipe.');
        }
    };

    const cleanInstructions = stripHtmlTags(recipe.instructions || "No instructions provided.");

    if (!recipe) {
        return <p>No recipe selected. Please go back.</p>;
    }

    return (
        <div className="recipeDetails-container">
            <h1>Kitchen Canvas</h1>
            <div className="recipeDetails-content">
                <h2>{recipe.title}</h2>
                <img src={recipe.image} alt={recipe.title} />
                <div className="recipeDetails-actions">
                    <button className="like-button"  onClick={handleLikeRecipe}>❤️ Like</button>
                    <button className="show-recipe-button" onClick={handleShowRecipe}> {showDetails ? 'Hide Recipe' : 'Show Recipe'}</button>
                </div>
            </div>
            {showDetails && (
                <div className="recipe-details">
                    <h2>Ingredients</h2>
                    <ul>
                        {recipe.extendedIngredients?.map((ingredient, index) => (
                            <li key={index}>{ingredient.original}</li>
                        ))}
                    </ul>
                    <h2>Instructions</h2>
                    <p>{cleanInstructions}</p> 
                </div>
            )}

            <div className="back-button-container">
                <button className="back-button" onClick={handleBack}>
                    Back
                </button>
            </div>
        </div>
    );
}

function stripHtmlTags(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

export default RecipeDetails;
