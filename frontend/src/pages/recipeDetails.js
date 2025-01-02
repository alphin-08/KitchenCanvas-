import React from 'react';
import { useLocation } from 'react-router-dom';
import './recipeDetails.css';

function RecipeDetails() {
    const location = useLocation();
    const { recipe } = location.state;

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
                    <button className="like-button">❤️ Like</button>
                    <button className="show-recipe-button">Show Recipe</button>
                </div>
            </div>
        </div>
    );
}

export default RecipeDetails;
