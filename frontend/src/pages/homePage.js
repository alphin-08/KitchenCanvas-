import './homePage.css';
import { Link } from "react-router-dom";
import React from 'react';

function Home() {

    
    return (
        <div class = "mainContainer-home">

            <div class = "topContainer-home">
                <h1>Kitchen Canvas</h1>
                <button>View Liked</button>
                <button>Search By Ingredients</button>
                <button>Upload New</button>

                <input type = 'text' placeholder='Search Recipes'/>
            </div>

            {/* <div class = "middleContainer-home">
                <input type='text' placeholder='Username'/>
                <button> <b>Login</b></button>
            </div> */}


            <div class = "bottomContainer-login">
                <Link to = '/createAccount'> 
                    <button><b>Create an Account</b></button>
                </Link>
                <Link to = '/guestMode'>
                    <button><b>Continue as Guest</b></button>
                </Link>
            </div>
        </div>
    ); 
}

export default Home;