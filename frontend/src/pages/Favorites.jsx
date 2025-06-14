import React, { useEffect, useState } from 'react';
import { getFavorites } from '../utils/recipeAPIHandler';
import Navbar from '../components/Navbar'
import RecipeCard from '../components/RecipeCard';

export default function Favorites() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavoriteRecipes = async () => {
            try {
                const response = await getFavorites();
                setRecipes(response);
            } catch (error) {
                console.error('Error fetching recipes:', error)
            } finally {
                setLoading(false);
            }
        }
        fetchFavoriteRecipes();
    }, [])

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
            <div className="flex flex-col items-center justify-center mt-10">
                <h1 className="text-4xl mb-6">Favorite Recipes</h1>
                
                    {recipes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-xl px-4">
                            {recipes.map(recipe => (
                                <RecipeCard key={recipe.id} recipe={recipe} startingIsFavorite={true} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">You have no favorite recipes.</p>
                    )}
            </div>
        </div>
    )
}