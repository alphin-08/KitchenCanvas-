import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './recipeDetails.css';

function RecipeDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { recipe } = location.state;
    const [showDetails, setShowDetails] = useState(false);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const isGuest = localStorage.getItem('isGuest') === 'true';
        if (isGuest) {
            // Check if recipe is liked by a guest
            const guestLikedRecipes =
                JSON.parse(localStorage.getItem('guestLikedRecipes')) || [];
            const isLiked = guestLikedRecipes.some(
                (r) => r.recipe_id === recipe.id
            );
            setLiked(isLiked);
        } else {
            // Check if recipe is liked by a logged-in user
            const userId = localStorage.getItem('userId');
            const checkIfLiked = async () => {
                if (userId) {
                    try {
                        const response = await fetch(
                            `${process.env.REACT_APP_BACKEND_URL}/api/likedRecipes?userId=${userId}`
                        );
                        const data = await response.json();
                        const isLiked = data.some(
                            (likedRecipe) => likedRecipe.recipe_id === recipe.id
                        );
                        setLiked(isLiked);
                    } catch (error) {
                        console.error('Error checking liked recipes:', error);
                    }
                }
            };
            checkIfLiked();
        }
    }, [recipe.id]);

    const handleShowRecipe = () => {
        setShowDetails(!showDetails);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleLikeRecipe = () => {
        const isGuest = localStorage.getItem('isGuest') === 'true';
        const guestLikedRecipes =
            JSON.parse(localStorage.getItem('guestLikedRecipes')) || [];

        if (isGuest) {
            // Handle likes for guest users
            if (liked) {
                // Unlike recipe
                const updatedRecipes = guestLikedRecipes.filter(
                    (r) => r.recipe_id !== recipe.id
                );
                localStorage.setItem(
                    'guestLikedRecipes',
                    JSON.stringify(updatedRecipes)
                );
            } else {
                // Like recipe
                const updatedRecipes = [
                    ...guestLikedRecipes,
                    {
                        recipe_id: recipe.id,
                        recipe_title: recipe.title,
                        recipe_image: recipe.image,
                    },
                ];
                localStorage.setItem(
                    'guestLikedRecipes',
                    JSON.stringify(updatedRecipes)
                );
            }
            setLiked(!liked);
        } else {
            // Handle likes for logged-in users
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('You need to log in to like recipes.');
                navigate('/login');
                return;
            }

            const url = liked
                ? `${process.env.REACT_APP_BACKEND_URL}/api/likedRecipes`
                : `${process.env.REACT_APP_BACKEND_URL}/api/likedRecipes`;
            const method = liked ? 'DELETE' : 'POST';

            fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    recipeId: recipe.id,
                    recipeTitle: recipe.title,
                    recipeImage: recipe.image,
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        setLiked(!liked);
                    } else {
                        return response.json().then((data) => {
                            alert(`Error: ${data.error}`);
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error liking recipe:', error);
                    alert('An error occurred while liking the recipe.');
                });
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
                <img src={recipe.image || 'https://via.placeholder.com/600x400?text=No+Image'} alt={recipe.title || 'No Image Available'} className = "recipe-image22"/>
                <div className="recipeDetails-actions">
                    <button
                        className={`like-button ${liked ? 'liked' : ''}`}
                        onClick={handleLikeRecipe}
                    >
                        ❤️
                    </button>
                    <button className="show-recipe-button" onClick={handleShowRecipe}>
                        {showDetails ? 'Hide Recipe' : 'Show Recipe'}
                    </button>
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
            <div className="backrdBtContainer">
                <button className="backrdBt" onClick={handleBack}>
                    Back
                </button>
            </div>
        </div>
    );
}

function stripHtmlTags(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}

export default RecipeDetails;

