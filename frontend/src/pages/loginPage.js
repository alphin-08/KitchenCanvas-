import './loginPage.css';
import { Link } from "react-router-dom";
import React from 'react';

function Login() {
    return (
        <div class = "mainContainer-login">

            <div class = "topContainer-login">
                <h1>Login</h1>
            </div>

            <div class = "middleContainer-login">
                <input type='text' placeholder='Username'/>
                <input type='text' placeholder='Password'/>
                <button> <b>Login</b></button>
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