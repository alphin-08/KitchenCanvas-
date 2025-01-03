import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './searchByIngredients.css';

function SearchByIngredients() {
    const [ingredient, setIngredient] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]); // State for storing fetched recipes
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const suggestions = ['Chicken', 'Beef', 'Onion', 'Garlic', 'Tomato', 'Cheese']; // Example suggestions

    const filteredSuggestions = suggestions.filter((item) =>
        item.toLowerCase().startsWith(ingredient.toLowerCase())
    );

    const handleCardClick = async (recipe) => {
        try {
            const response = await fetch(`http://localhost:5000/api/recipeDetails?id=${recipe.id}`);
            const detailedRecipe = await response.json();
            navigate('/recipeDetails', { state: { recipe: detailedRecipe } });
        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
    };

    const handleAddIngredient = () => {
        const trimmedIngredient = ingredient.trim().toLowerCase();
        if (trimmedIngredient && !selectedIngredients.includes(trimmedIngredient)) {
            setSelectedIngredients([...selectedIngredients, trimmedIngredient]);
            setIngredient('');
        } else if (trimmedIngredient) {
            alert(`${ingredient} is already added.`);
            setIngredient('');
        }
    };

    const handleRemoveIngredient = (removedIngredient) => {
        setSelectedIngredients(selectedIngredients.filter((ing) => ing !== removedIngredient));
    };

    const handleSearch = async () => {
        if (selectedIngredients.length === 0) {
            alert('Please add at least one ingredient.');
            return;
        }

        try {
            const query = selectedIngredients.join(',');
            const response = await fetch(`http://localhost:5000/api/searchByIngredients?ingredients=${query}`);
            const data = await response.json();
            setRecipes(data); // Set fetched recipes to state
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    return (
        <div className="searchByIngredients-container">
            <h1>Search Recipes by Ingredients</h1>
            <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
            <div className="search-input">
                <input
                    type="text"
                    placeholder="Type an ingredient..."
                    value={ingredient}
                    onChange={(e) => setIngredient(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                />
                <button onClick={handleAddIngredient}>Add Ingredient</button>
                {isFocused && filteredSuggestions.length > 0 && (
                    <div className="autocomplete-dropdown">
                        {filteredSuggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="suggestion-item"
                                onClick={() => {
                                    const normalizedSuggestion = suggestion.toLowerCase();
                                    if (!selectedIngredients.includes(normalizedSuggestion)) {
                                        setSelectedIngredients([...selectedIngredients, normalizedSuggestion]);
                                    }
                                    setIngredient('');
                                    setIsFocused(false);
                                }}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="ingredient-tags">
                {selectedIngredients.map((ing, index) => (
                    <div key={index} className="ingredient-tag">
                        {ing.charAt(0).toUpperCase() + ing.slice(1)} {/* Capitalize the first letter */}
                        <button onClick={() => handleRemoveIngredient(ing)}>X</button>
                    </div>
                ))}
            </div>
            <button className="search-button" onClick={handleSearch}>
                Search Recipes
            </button>

            {/* Render recipes */}
            <div className="recipes-container2">
                {recipes.length > 0 &&
                    recipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card2" onClick={() => handleCardClick(recipe)} >
                            <img src={recipe.image} alt={recipe.title} />
                            <p>{recipe.title}</p>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default SearchByIngredients;



