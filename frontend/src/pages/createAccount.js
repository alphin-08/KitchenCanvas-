import { Link, useNavigate} from "react-router-dom";
import './createAccount.css';
import React, { useState } from 'react';
import '../AppLayout.css';

function CreateAccount() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null); // { type: 'success'|'error', text: string }
    const navigate = useNavigate();

    const handleCreateAccount = async () => {
        const u = username.trim();
        const p = password.trim();
        const c = confirmPassword.trim();

        if (!u || !p || !c) {
            setMessage({ type: 'error', text: 'Please fill in all fields.' });
            return;
        }
        if (p !== c) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: u, password: p })
            });

            const data = await response.json();
            if (response.ok) {
                setMessage({ type: 'success', text: 'Account created successfully! Redirecting to login…' });
                setTimeout(() => navigate('/loginPage'), 1200);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to create account. Please try again.' });
            }
        } catch (error) {
            console.error('Error creating account:', error);
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        }
    };

    return (
        <div className="main-container">
            <div className="mainContainer-create">

                <div className="topContainer-create">
                    <h1>Create an</h1>
                    <h1>Account</h1>
                </div>

                <div className="middleContainer-create">
                    <input type='text' placeholder='Create a Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type='password' placeholder='Create a Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input type='password' placeholder='Re-Enter Password'  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    {message && (
                        <p className={message.type === 'success' ? 'success-message' : 'error-message'}>
                            {message.text}
                        </p>
                    )}
                </div>


                <div className="bottomContainer-create">
                    <Link to='/loginPage'> 
                        <button><b>Back</b></button>
                    </Link>
                    <button onClick={handleCreateAccount}><b>Create</b></button>
                </div>
            </div>
        </div>
    ); 
}

export default CreateAccount;