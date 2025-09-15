import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signOut.css';
import '../AppLayout.css';

function SignOut() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        // Simulate fetching username from backend or state
        const fetchUsername = async () => {
            try {
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
        <div className="main-container">
            <div className="signOut-container">
                <h2>Goodbye, {username}!</h2>
                <p>Are you sure you want to sign out?</p>
                <button className="signOut-button" onClick={handleSignOut}>
                    Confirm Sign Out
                </button>
                <button className = "backfromso" onClick={() => navigate(-1)}>Back</button>
            </div>
        </div>
    );
}

export default SignOut;

