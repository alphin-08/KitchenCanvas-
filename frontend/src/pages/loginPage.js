import './loginPage.css';
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {

        if (!username || !password) {
            setMessage('Please enter both username and password.');
            return;
        }
        
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Login successful!');
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('username', data.user.username);
                localStorage.setItem('isGuest', 'false');
                setTimeout(() => navigate('/homePage'), 2000);
            } else {
                setMessage(data.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            
            setMessage('An error occurred. Please try again.');
        }
    };

    const handleGuestLogin = () => {
        // Set guest-specific data in localStorage
        localStorage.setItem('isGuest', 'true'); // Mark the user as a guest
        localStorage.removeItem('userId'); // Remove userId if it exists
        localStorage.removeItem('username'); // Remove username if it exists
        navigate('/homePage');
    };


    return (
        <div class = "mainContainer-login">

            <div class = "topContainer-login">
                <h1>Login</h1>
            </div>

            <div class = "middleContainer-login">
                <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type='password' placeholder='Password'  value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleLogin}> <b>Login</b></button>
                {message && (
                    <p className={message === 'Login successful!' ? "success-message" : "error-message"}>{message}
                    </p>
                )}
            </div>


            <div class = "bottomContainer-login">
                <Link to = '/createAccount'> 
                    <button><b>Create an Account</b></button>
                </Link>
                <Link to = '/homePage'>
                    <button onClick={handleGuestLogin}><b>Continue as Guest</b></button>
                </Link>
            </div>
        </div>
    ); 
}

export default Login;