import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './likedRecipes.css';

function LikedRecipes() {
    const [likedRecipes, setLikedRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLikedRecipes = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/likedRecipes?userId=1`); // Need to replace 1 with the logged-in userId
                const data = await response.json();
                setLikedRecipes(data || []);
            } catch (error) {
                console.error('Error fetching liked recipes:', error);
            }
        };
        fetchLikedRecipes();
    }, []);

    return (
        <div className="likedRecipes-container">
            <h1>Liked Recipes</h1>
            <div className="likedRecipes-list">
                {likedRecipes.length > 0 ? (
                    likedRecipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card" onClick={() => navigate('/recipeDetails', { state: { recipe } })}>
                            <img src={recipe.recipe_image} alt={recipe.recipe_title} />
                            <p>{recipe.recipe_title}</p>
                        </div>
                    ))
                ) : (
                    <p>No liked recipes found.</p>
                )}
            </div>
            <button onClick={() => navigate(-1)}>Back</button>
        </div>
    );
}

export default LikedRecipes;
