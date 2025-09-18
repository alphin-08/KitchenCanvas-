import React, { useEffect, useState } from 'react';
import './homePage.css';
import { useNavigate, Link } from 'react-router-dom';
import '../AppLayout.css';

function Home() {
    const [recipes, setRecipes] = useState([]); // State to store recipes
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [randomLoaded, setRandomLoaded] = useState(false); // have we attempted random fetch?
    const navigate = useNavigate();

    const CACHE_KEY = 'cachedRandomRecipes';
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

    const fetchRandomRecipes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipes`);
            const data = await response.json();
            const list = data.recipes || [];
            setRecipes(list);
            setRandomLoaded(true);
            // cache with timestamp
            localStorage.setItem(CACHE_KEY, JSON.stringify({ recipes: list, ts: Date.now() }));
        } catch (error) {
            console.error('Error fetching random recipes:', error);
            setRandomLoaded(true);
        } finally {
            setLoading(false);
        }
    };

    const fetchSearchRecipes = async (term) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/searchRecipes?query=${encodeURIComponent(term)}`);
            const data = await response.json();
            setRecipes(data.recipes || []);
        } catch (error) {
            console.error('Error searching recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm.trim()) {
            fetchSearchRecipes(searchTerm.trim());
        } else {
            // try cache; do not auto-fetch to save API calls
            const cachedRaw = localStorage.getItem(CACHE_KEY);
            if (cachedRaw) {
                const cached = JSON.parse(cachedRaw);
                if (cached?.recipes && Date.now() - cached.ts < CACHE_TTL) {
                    setRecipes(cached.recipes);
                    setRandomLoaded(true);
                    return;
                } else {
                    localStorage.removeItem(CACHE_KEY);
                }
            }
            // no cache; wait for user to press Refresh
            setRecipes([]);
            setRandomLoaded(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const handleRefresh = () => {
        // clear search and fetch fresh random recipes
        if (searchTerm) setSearchTerm('');
        fetchRandomRecipes();
    };

    const handleCardClick = (recipe) => {
        navigate('/recipeDetails', { state: { recipe } });
    };

    return (
        <div className="main-container">
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
                    <div className="search-refresh-row">
                        <input
                            type="text"
                            placeholder="Search Recipes"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className="refresh-button"
                            onClick={handleRefresh}
                            disabled={loading}
                            title="Get 9 new random recipes"
                        >
                            {loading ? 'Loading…' : 'Refresh'}
                        </button>
                    </div>
                </div>

                <div className="bottomContainer-home">
                    {!searchTerm && !randomLoaded && recipes.length === 0 ? (
                        <div className="api-limit-message">
                            Tap Refresh to load recipes.
                        </div>
                    ) : recipes.length === 0 ? (
                        <div className="api-limit-message">
                            Sorry, our recipe API limit has been reached for today.<br />
                            Please check back tomorrow for more recipes!
                        </div>
                    ) : (
                        recipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="recipe-cardH"
                                onClick={() => handleCardClick(recipe)}
                            >
                                <img src={recipe.image} alt={recipe.title} />
                                <p>{recipe.title}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
