import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { searchRecipes } from '../utils/recipeAPIHandler';
import { getCurrentUser } from '../utils/authAPIHandler';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';

export default function Search() {
    const { query } = useParams();
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            console.log('Fetching recipes for query:', query);
            try {
                const results = await searchRecipes(query);
                const user = await getCurrentUser();
                console.log('User data:', user);
                console.log('Search results:', results);
                setRecipes(results);
                setFavoriteRecipes(user.favorite_recipes || []);
            } catch (error) {
                console.error('Error fetching search results:', error);
                alert('Failed to fetch search results. Please try again.');
            } finally {
                setLoading(false);
            }
        }
        fetchRecipes();
    }, [query]);

    if (loading) {
        return (
            <div className="flex flex-col bg-gray-100 h-screen">
                <Navbar />
                <div className="flex items-center justify-center">
                    <h1 className="text-3xl">Loading...</h1>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col bg-gray-100 h-screen">
            <Navbar />
            {recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-xl px-4 mt-6">
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} startingIsFavorite={favoriteRecipes.includes(recipe.id)} />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full mt-6">
                    <h1 className="text-3xl">No results found for "{query}"</h1>
                </div>
            )}
        </div>
    )
}