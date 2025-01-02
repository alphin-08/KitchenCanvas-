import { Link } from "react-router-dom";
import './createAccount.css';
import React from 'react';

function CreateAccount() {
    return (
        <div class = "mainContainer-create">

            <div class = "topContainer-create">
                <h1>Create an</h1>
                <h1>Account</h1>
            </div>

            <div class = "middleContainer-create">
                <input type='text' placeholder='Create a Username'/>
                <input type='text' placeholder='Create a Password'/>
                <input type='text' placeholder='Re-Enter Password'/>
            </div>


            <div class = "bottomContainer-create">
                <Link to = '/loginPage'> 
                    <button><b>Back</b></button>
                </Link>
                <button><b>Create</b></button>
            </div>
        </div>
    ); 
}

export default CreateAccount;