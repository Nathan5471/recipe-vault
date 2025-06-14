import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, getUserRecipes } from '../utils/recipeAPIHandler';
import { getCurrentUser } from '../utils/authAPIHandler';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard'

export default function HomePage() {
    const [user, setUser] = useState(null)
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [myRecipes, setMyRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response1 = await getFavorites();
                const user = await getCurrentUser();
                setUser(user)
                if (user) {
                    const response2 = await getUserRecipes(user.id);
                    setMyRecipes(response2)
                }
                setFavoriteRecipes(response1)
            } catch (error) {
                console.error('Error fetching recipes:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchRecipes();
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
        <div className="flex flex-col bg-gray-100 min-h-screen">
            <Navbar />
            <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-4 rounded-lg w-[calc(80%)]">
                    <h2 className="text-4xl mb-6">Favorite Recipes</h2>
                    {favoriteRecipes.length > 0 ? (
                        <div className="flex flex-row">
                            {favoriteRecipes.map(recipe => (
                                <RecipeCard  key={recipe.id} recipe={recipe} startingIsFavorite={true}/>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">You have no favorited recipes.</p>
                    )}
                </div>
                <div className="bg-white p-4 rounded-lg w-[calc(80%)] mt-6">
                    <h2 className="text-4xl mb-6">My Recipes</h2>
                    {myRecipes.length > 0 ? (
                        <div className="flex flex-row">
                            {myRecipes.map(recipe => (
                                <RecipeCard key={recipe.id} recipe={recipe} startingIsFavorite={user.favorite_recipes.includes(recipe.id)} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">You have no recipes.</p>
                    )}
                </div>
                <div className="bg-white p-4 rounded-lg w-[calc(80%)] mt-6">
                    <h2 className="text-4xl mb-6">Recent Recipes</h2>
                </div>
            </div>
        </div>
    )
}