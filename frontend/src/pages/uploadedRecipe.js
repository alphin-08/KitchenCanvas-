import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './uploadedRecipes.css';

function UploadedRecipes() {
    const [uploadedRecipes, setUploadedRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUploadedRecipes = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('You need to be logged in to view your uploaded recipes.');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/uploadedRecipes?userId=${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setUploadedRecipes(data);
                } else {
                    alert(data.error || 'Failed to fetch uploaded recipes.');
                }
            } catch (error) {
                console.error('Error fetching uploaded recipes:', error);
                alert('An error occurred. Please try again.');
            }
        };

        fetchUploadedRecipes();
    }, []);

    return (
        <div className="uploadedRecipes-container">
            <h1>Your Uploaded Recipes</h1>
            {uploadedRecipes.length > 0 ? (
                <div className="recipe-list3">
                    {uploadedRecipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card3">
                            <h2>{recipe.name}</h2>
                            <p><b>Ingredients:</b> {recipe.ingredients}</p>
                            <p><b>Steps:</b> {recipe.steps}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No recipes uploaded yet.</p>
            )}

            <button className = "backfromUploadedR" onClick={() => navigate(-1)}>Back</button>
        </div>

        
    );
}

export default UploadedRecipes;
