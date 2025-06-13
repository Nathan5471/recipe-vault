import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../utils/authAPIHandler';
import { getUserRecipes } from '../utils/recipeAPIHandler';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard';

export default function MyRecipes() {
    const [user, setUser] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
                if (userData) {
                    const userRecipes = await getUserRecipes(userData.id);
                    setRecipes(userRecipes);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, []);

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
        <div className="flex flex-col bg-gray-100 min-h-screen">
            <Navbar />
            <div className="flex flex-col items-center justify-center mt-10">
                <h1 className="text-4xl mb-6">My Recipes</h1>
                
                    {recipes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-xl px-4">
                            {recipes.map(recipe => (
                                <RecipeCard key={recipe.id} recipe={recipe} startingIsFavorite={user.favorite_recipes.includes(recipe.id)} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">You have no recipes yet. Start creating some!</p>
                    )}
            </div>
        </div>
    )
}