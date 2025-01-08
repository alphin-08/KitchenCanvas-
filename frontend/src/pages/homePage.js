import React, { useEffect, useState } from 'react';
import './homePage.css';
import { useNavigate,  Link} from 'react-router-dom';

function Home() {
    const [recipes, setRecipes] = useState([]); // State to store recipes
    const [searchTerm, setSearchTerm] = useState(''); 
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch 12 random recipes from the backend
        const fetchRecipes = async () => {
            try {
                const endpoint = searchTerm
                    ? `http://localhost:5000/api/searchRecipes?query=${searchTerm}`
                    : `http://localhost:5000/api/recipes`;
                
                const response = await fetch(endpoint); 
                const data = await response.json();
                setRecipes(data.recipes || []);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };
        fetchRecipes();
    }, [searchTerm]);


    const handleCardClick = (recipe) => {
        navigate('/recipeDetails', { state: { recipe } });
    };


    return (
        <div className="mainContainer-home">
            <div className="veryTopContainer-home">
                <Link to="/homePage" className="home-link">
                    <h1>Kitchen Canvas</h1>
                </Link>
            </div>
            <div className="topContainer-home">
                <button onClick={() => navigate('/likedRecipes')} >View Liked</button>
                <button onClick={() => navigate('/searchByIngredients')}>Search By Ingredients</button>
                <button onClick={() => navigate('/uploadRecipe')}>Upload New</button>
                <button onClick={() => navigate('/signOut')}>Sign Out</button>
            </div>

            
            <div className="middleContainer-home">
                <input type="text" placeholder="Search Recipes"  value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
            </div>


            <div className="bottomContainer-home">
                {recipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="recipe-cardH"
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
