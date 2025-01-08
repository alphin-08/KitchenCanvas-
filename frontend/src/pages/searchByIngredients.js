import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './searchByIngredients.css';

function SearchByIngredients() {
    const [ingredient, setIngredient] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]); // State for storing fetched recipes
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const suggestions = [
    'Chicken', 'Beef', 'Pork', 'Lamb', 'Fish', 'Shrimp', 'Crab', 'Lobster', 
    'Eggs', 'Milk', 'Butter', 'Cream', 'Yogurt', 'Cheese', 'Ricotta', 'Mozzarella',
    'Parmesan', 'Blue Cheese', 'Cheddar', 'Feta', 'Goat Cheese', 'Cottage Cheese',
    'Carrot', 'Onion', 'Garlic', 'Celery', 'Tomato', 'Potato', 'Sweet Potato', 
    'Bell Pepper', 'Cucumber', 'Zucchini', 'Eggplant', 'Spinach', 'Kale', 'Lettuce',
    'Mushroom', 'Peas', 'Corn', 'Green Beans', 'Broccoli', 'Cauliflower', 'Cabbage',
    'Beets', 'Radish', 'Leek', 'Scallion', 'Parsnip', 'Turnip', 'Asparagus',
    'Avocado', 'Apple', 'Banana', 'Orange', 'Lemon', 'Lime', 'Strawberry',
    'Blueberry', 'Raspberry', 'Blackberry', 'Pineapple', 'Mango', 'Papaya',
    'Peach', 'Plum', 'Grapes', 'Watermelon', 'Cantaloupe', 'Honeydew', 
    'Nuts', 'Almond', 'Cashew', 'Walnut', 'Pistachio', 'Hazelnut', 
    'Flour', 'Sugar', 'Salt', 'Pepper', 'Paprika', 'Cinnamon', 'Nutmeg', 'Vanilla',
    'Honey', 'Maple Syrup', 'Baking Powder', 'Baking Soda', 'Cocoa Powder',
    'Chili Powder', 'Coriander', 'Cumin', 'Turmeric', 'Black Pepper', 'Ginger', 'Oregano',
    'Thyme', 'Rosemary', 'Basil', 'Parsley', 'Cilantro', 'Mint', 'Bay Leaf',
    'Soy Sauce', 'Vinegar', 'Olive Oil', 'Vegetable Oil', 'Sesame Oil', 
    'Coconut Milk', 'Tofu', 'Tempeh', 'Lentils', 'Chickpeas', 'Kidney Beans',
    'Black Beans', 'White Beans', 'Rice', 'Quinoa', 'Couscous', 'Pasta', 'Noodles',
    'Bread', 'Tortilla', 'Pita', 'Crackers', 'Oats', 'Granola'
];

    const filteredSuggestions = suggestions.filter((item) =>
        item.toLowerCase().startsWith(ingredient.toLowerCase())
    );

    const handleCardClick = async (recipe) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipeDetails?id=${recipe.id}`);
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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/searchByIngredients?ingredients=${query}`);
            const data = await response.json();
            setRecipes(data); // Set fetched recipes to state
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    return (
        <div className="searchByIngredients-container">
            <Link to="/homePage" className="home-link">
                <h1>Kitchen Canvas</h1>
            </Link>
            <h2>Search Recipes by Ingredients</h2>
            <button className="backsnBT" onClick={() => navigate(-1)}>Go Back</button>
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



