import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OverlayProvider } from './contexts/OverlayContext';
import AuthenticatedRoute from './utils/AuthenticatedRoute';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateRecipe from './pages/CreateRecipe';
import MyRecipes from './pages/MyRecipes';
import Favorites from './pages/Favorites';
import AllRecipes from './pages/AllRecipes';
import RecipeView from './pages/RecipeView';
import EditRecipe from './pages/EditRecipe';
import Search from './pages/Search';
import Settings from './pages/Settings';
import ManageAccounts from './pages/ManageAccounts';
import Overlay from './components/Overlay';

function App() {
  return (
    <OverlayProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AuthenticatedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateRecipe />} />
          <Route path="/myrecipes" element={<MyRecipes />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/all" element={<AllRecipes />} />
          <Route path="/recipe/:recipeId" element={<RecipeView />} />
          <Route path="/edit/:recipeId" element={<EditRecipe />} />
          <Route path="/search/:query" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route element={<AuthenticatedRoute allowedAccountTypes={['admin']} />}>
          <Route path="/manageaccounts" element={<ManageAccounts />} />
        </Route>
      </Routes>
    </Router>
    <Overlay />
    </OverlayProvider>
  )
}

export default App
