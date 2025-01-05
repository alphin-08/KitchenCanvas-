import './loginPage.css';
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Login successful!');
                // Save user info (if needed)
                console.log('Login successful. User ID:', data.user.id); // Debugging
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('username', data.user.username);
                navigate('/homePage');
            } else {
                alert(data.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred. Please try again.');
        }
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
            </div>


            <div class = "bottomContainer-login">
                <Link to = '/createAccount'> 
                    <button><b>Create an Account</b></button>
                </Link>
                <Link to = '/homePage'>
                    <button><b>Continue as Guest</b></button>
                </Link>
            </div>
        </div>
    ); 
}

export default Login;