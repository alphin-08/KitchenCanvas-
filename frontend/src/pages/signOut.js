import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signOut.css'; // Import the CSS file

function SignOut() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        // Simulate fetching username from backend or state
        const fetchUsername = async () => {
            try {
                // Replace with your actual API or localStorage logic
                const storedUsername = localStorage.getItem('username') || 'Guest'; 
                const guestStatus = localStorage.getItem('isGuest') === 'true';
                setUsername(storedUsername);
                setIsGuest(guestStatus);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        fetchUsername();
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('username'); 
        localStorage.removeItem('userId');
        localStorage.removeItem('isGuest');

        if (isGuest) {
            // Clear guest-specific data
            localStorage.removeItem('guestLikedRecipes');
            localStorage.removeItem('guestUploadedRecipes'); 
        }
        
        console.log('User signed out');
        navigate('/');
    };

    return (
        <div className="signOut-container">
            <h2>Goodbye, {username}!</h2>
            <p>Are you sure you want to sign out?</p>
            <button className="signOut-button" onClick={handleSignOut}>
                Confirm Sign Out
            </button>
            <button className = "backfromso" onClick={() => navigate(-1)}>Back</button>
        </div>
    );
}

export default SignOut;

