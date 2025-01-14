import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MainScreen from './pages/mainPage';
import Login from './pages/loginPage';
import CreateAccount from './pages/createAccount';
import Home from './pages/homePage';
import RecipeDetails from './pages/recipeDetails';
import NotFound from './pages/NotFound';
import SearchByIngredients from './pages/searchByIngredients'; 
import LikedRecipes from './pages/likedRecipes';
import SignOut from './pages/signOut';
import UploadNewRecipe from './pages/uploadRecipe'
import UploadedRecipes from './pages/uploadedRecipe'


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<MainScreen/>} />
        <Route path="/loginPage" element={<Login/>} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/homePage" element={<Home />} />
        <Route path="/recipeDetails" element={<RecipeDetails />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/searchByIngredients" element={<SearchByIngredients />} />
        <Route path="/likedRecipes" element={<LikedRecipes />} />
        <Route path="/signOut" element={<SignOut />} />
        <Route path="/uploadRecipe" element={<UploadNewRecipe />} />
        <Route path = "/uploadedRecipes" element = {<UploadedRecipes/>} />
      </Routes>
    </Router>
  );
}

export default App;
