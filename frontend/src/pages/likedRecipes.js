import React, { useEffect, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './likedRecipes.css';

function LikedRecipes() {
    const [likedRecipes, setLikedRecipes] = useState([]);
    const navigate = useNavigate();
    const isGuest = localStorage.getItem('isGuest') === 'true'; 
    const userId = localStorage.getItem('userId'); 

    useEffect(() => {
        if (isGuest) {
            // Load guest liked recipes from localStorage
            const guestRecipes = JSON.parse(localStorage.getItem('guestLikedRecipes')) || [];
            setLikedRecipes(guestRecipes);
        } else {
            // Fetch liked recipes from the backend for logged-in users
            const fetchLikedRecipes = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/likedRecipes?userId=${userId}`);
                    const data = await response.json();
                    setLikedRecipes(data || []);
                } catch (error) {
                    console.error('Error fetching liked recipes:', error);
                }
            };
            fetchLikedRecipes();
        }
    }, [isGuest, userId]);

    const handleRecipeClick = async (recipeId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipeDetails?id=${recipeId}`);
            const data = await response.json();

            if (response.ok) {
                navigate('/recipeDetails', { state: { recipe: data } });
            } else {
                alert('Failed to fetch recipe details.');
            }
        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
    };

    
    const handleRemoveLikedRecipe = async (recipeId) => {

        const userId = localStorage.getItem('userId');

        if (!userId) {
            alert('You need to log in to modify liked recipes.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/likedRecipes`, {
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
            <Link to="/homePage" className="home-link">
                <h1>Kitchen Canvas</h1>
            </Link>
            <h2>Liked Recipes</h2>
            <div className="likedRecipes-list">
                {likedRecipes.length > 0 ? (
                    likedRecipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-cardLR"   onClick={() => handleRecipeClick(recipe.recipe_id)}>
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
