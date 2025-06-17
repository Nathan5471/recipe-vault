import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFavorites, getAllRecipes, getUserRecipes } from '../utils/recipeAPIHandler';
import { getCurrentUser } from '../utils/authAPIHandler';
import Navbar from '../components/Navbar';
import RecipeCard from '../components/RecipeCard'

export default function HomePage() {
    const [user, setUser] = useState(null)
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [myRecipes, setMyRecipes] = useState([]);
    const [recentRecipes, setRecentRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response1 = await getFavorites();
                if (response1.length > 4) {
                    response1.length = 4;
                }
                const user = await getCurrentUser();
                setUser(user)
                if (user) {
                    const response2 = await getUserRecipes(user.id);
                    if (response2.length > 4) {
                        response2.length = 4;
                    }
                    setMyRecipes(response2)
                }
                const response3 = await getAllRecipes(4, 'recent_desc');
                setFavoriteRecipes(response1)
                setRecentRecipes(response3);
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
                    <div className="flex flex-row">
                        <h2 className="text-4xl mb-6">Favorite Recipes</h2>
                        <Link to="/favorites" className="ml-auto text-gray-500 hover:underline">View All</Link>
                    </div>
                    
                    {favoriteRecipes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {favoriteRecipes.map(recipe => (
                                <RecipeCard  key={recipe.id} recipe={recipe} startingIsFavorite={true}/>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">You have no favorited recipes.</p>
                    )}
                </div>
                <div className="bg-white p-4 rounded-lg w-[calc(80%)] mt-6">
                    <div className="flex flex-row">
                        <h2 className="text-4xl mb-6">My Recipes</h2>
                        <Link to="/myrecipes" className="ml-auto text-gray-500 hover:underline">View All</Link>
                    </div>
                    {myRecipes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {myRecipes.map(recipe => (
                                <RecipeCard key={recipe.id} recipe={recipe} startingIsFavorite={user.favorite_recipes.includes(recipe.id)} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">You have no recipes.</p>
                    )}
                </div>
                <div className="bg-white p-4 rounded-lg w-[calc(80%)] mt-6 mb-2">
                    <div className="flex flex-row">
                        <h2 className="text-4xl mb-6">Recent Recipes</h2>
                        <Link to="/all" className="ml-auto text-gray-500 hover:underline">View All</Link>
                    </div>
                    {recentRecipes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {recentRecipes.map(recipe => (
                                <RecipeCard key={recipe.id} recipe={recipe} startingIsFavorite={user && user.favorite_recipes.includes(recipe.id)} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No recent recipes available.</p>
                    )}
                </div>
            </div>
        </div>
    )
}