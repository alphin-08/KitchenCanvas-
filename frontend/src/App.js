import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MainScreen from './pages/mainPage';
import Login from './pages/loginPage';
import CreateAccount from './pages/createAccount';
import Home from './pages/homePage';
import RecipeDetails from './pages/recipeDetails';
import NotFound from './pages/NotFound';


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
      </Routes>
    </Router>
  );
}

export default App;
