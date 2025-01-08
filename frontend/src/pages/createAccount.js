import { Link, useNavigate} from "react-router-dom";
import './createAccount.css';
import React, { useState } from 'react';

function CreateAccount() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleCreateAccount = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Account created successfully!');
                navigate('/loginPage');
            } else {
                alert(data.error || 'Failed to create account. Please try again.');
            }
        } catch (error) {
            console.error('Error creating account:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div class = "mainContainer-create">

            <div class = "topContainer-create">
                <h1>Create an</h1>
                <h1>Account</h1>
            </div>

            <div class = "middleContainer-create">
                <input type='text' placeholder='Create a Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type='text' placeholder='Create a Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type='text' placeholder='Re-Enter Password'  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>


            <div class = "bottomContainer-create">
                <Link to = '/loginPage'> 
                    <button><b>Back</b></button>
                </Link>
                <button onClick={handleCreateAccount}><b>Create</b></button>
            </div>
        </div>
    ); 
}

export default CreateAccount;