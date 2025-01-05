import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './likedRecipes.css';

function LikedRecipes() {
    const [likedRecipes, setLikedRecipes] = useState([]);
    const navigate = useNavigate();

    const handleNavigate = useCallback(() => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert('You need to log in to view liked recipes.');
            navigate('/login'); // Redirect to login if userId is missing
        }
    }, [navigate]);

    useEffect(() => {
        const fetchLikedRecipes = async () => {
        
            const userId = localStorage.getItem('userId');

            if (!userId) {
                handleNavigate();
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/likedRecipes?userId=${userId}`); // Need to replace 1 with the logged-in userId
                const data = await response.json();
                setLikedRecipes(data || []);
            } catch (error) {
                console.error('Error fetching liked recipes:', error);
            }
        };
        fetchLikedRecipes();
    }, [handleNavigate]);

    const handleRemoveLikedRecipe = async (recipeId) => {

        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert('You need to log in to modify liked recipes.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/likedRecipes`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, recipeId }), // Replace 1 with the logged-in userId
            });

            if (response.ok) {
                setLikedRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.recipe_id !== recipeId));
            } else {
                console.error('Failed to remove liked recipe.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className="likedRecipes-container">
            <h1>Kitchen Canvas</h1>
            <h2>Liked Recipes</h2>
            <div className="likedRecipes-list">
                {likedRecipes.length > 0 ? (
                    likedRecipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card" onClick={() => navigate('/recipeDetails', { state: { recipe } })}>
                            <img src={recipe.recipe_image} alt={recipe.recipe_title} />
                            <p>{recipe.recipe_title}</p>
                            <button className="remove-button" onClick={(e) => { e.stopPropagation(); handleRemoveLikedRecipe(recipe.recipe_id); }}>X</button>
                        </div>
                    ))
                ) : (
                    <p>No liked recipes found.</p>
                )}
            </div>
            <button className = "backfromlr" onClick={() => navigate(-1)}>Back</button>
        </div>
    );
}

export default LikedRecipes;
