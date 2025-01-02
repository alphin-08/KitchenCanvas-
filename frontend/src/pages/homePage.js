import React, { useEffect, useState } from 'react';
import './homePage.css';
import { useNavigate } from 'react-router-dom';


function Home() {
    // const dummyRecipes = Array.from({ length: 9 }, (_, index) => ({
    //     id: index + 1,
    //     title: `Recipe ${index + 1}`,
    //     image: 'https://via.placeholder.com/150', // Placeholder image for now
    // }));
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch 9 random recipes
        const fetchRecipes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/recipes');
                const data = await response.json();
                setRecipes(data.recipes || []);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };
        fetchRecipes();
    }, []);

    const handleCardClick = (recipe) => {
        // Navigate to the recipe details page and pass the recipe data
        navigate('/recipeDetails', { state: { recipe } });
    };
    return (
        <div class="mainContainer-home">
            <div class = "veryTopContainer-home">
                <h1>Kitchen Canvas</h1>
            </div>
            <div class = "topContainer-home">
                <button>View Liked</button>
                <button>Search By Ingredients</button>
                <button>Upload New</button>
            </div>

            <div class = "middleContainer-home">
                <input type = 'text' placeholder='Search Recipes'/>
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