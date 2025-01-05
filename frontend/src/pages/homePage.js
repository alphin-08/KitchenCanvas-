import React, { useEffect, useState } from 'react';
import './homePage.css';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [recipes, setRecipes] = useState([]); // State to store recipes
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch 12 random recipes from the backend
        const fetchRecipes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/recipes'); // Backend endpoint
                const data = await response.json();
                setRecipes(data.recipes || []);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };
        fetchRecipes();
    }, []);


    const handleCardClick = (recipe) => {
        navigate('/recipeDetails', { state: { recipe } });
    };


    return (
        <div className="mainContainer-home">
            <div className="veryTopContainer-home">
                <h1>Kitchen Canvas</h1>
            </div>
            <div className="topContainer-home">
                <button onClick={() => navigate('/likedRecipes')} >View Liked</button>
                <button onClick={() => navigate('/searchByIngredients')}>Search By Ingredients</button>
                <button>Upload New</button>
                <button onClick={() => navigate('/signOut')}>Sign Out</button>
            </div>
            <div className="middleContainer-home">
                <input type="text" placeholder="Search Recipes" />
            </div>
            <div className="bottomContainer-home">
                {recipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="recipe-card"
                        onClick={() => handleCardClick(recipe)}
                    >
                        <img src={recipe.image} alt={recipe.title} />
                        <p>{recipe.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
