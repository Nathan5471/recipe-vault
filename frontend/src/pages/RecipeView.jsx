import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipe } from '../utils/recipeAPIHandler';
import { getCurrentUser } from '../utils/authAPIHandler';
import { useOverlayContext } from '../contexts/OverlayContext';
import Navbar from '../components/Navbar';
import DeleteRecipe from '../components/DeleteRecipe';


export default function RecipeView() {
    const { openOverlay } = useOverlayContext();
    const navigate = useNavigate();
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [canEdit, setCanEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const recipeData = await getRecipe(recipeId);
                setRecipe(recipeData);
                const currentUser = await getCurrentUser();
                console.log('Current User:', currentUser);
                console.log('Recipe Data:', recipeData);
                if (currentUser) {
                    setCanEdit(currentUser.id === recipeData.user_id || currentUser.account_type === 'admin');
                }
            } catch (error) {
                console.error('Error fetching recipe:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchRecipe();
    }, [recipeId]);

    const handleEdit = (e) => {
        e.preventDefault();
        if (canEdit) {
            navigate(`/edit/${recipeId}`);
        }
    }


    const handleDelete = (e) => {
        e.preventDefault();
        openOverlay(<DeleteRecipe recipeId={recipeId} recipeName={recipe.title} />);
    }

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
            <div className="flex flex-row p-4">
                <img
                    src={`${window.location.origin}/images/${recipe.image_url}`}
                    alt={recipe.title}
                    className="w-1/3 h-auto object-cover rounded-lg mr-4"
                />
                <div className="w-2/3 flex flex-col">
                    <div className="flex flex-row mb-2">
                        <h1 className="text-4xl font-bold">{recipe.title}</h1>
                        {canEdit && (
                            <div className="ml-auto flex flex-row">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={handleEdit}
                                >Edit</button>
                                <button
                                    className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={handleDelete}
                                >Delete</button>
                            </div>
                        )}
                    </div>
                    <p className="text-xl">{recipe.description}</p>
                </div>
            </div>
            <div className="flex flex-row p-4">
                <div className="w-1/3">
                    <h2 className="text-2xl font-semibold mb-2">Ingredients:</h2>
                    <ul className="list-disc pl-5">
                        {JSON.parse(recipe.ingredients).map((ingredient, index) => (
                            <li key={index} className="text-lg">{ingredient.name} - {ingredient.quantity} {ingredient.unit}</li>
                        ))}
                    </ul>
                </div>
                <div className="w-2/3">
                    <h2 className="text-2xl font-semibold mb-2">Instructions:</h2>
                    <ol className="list-decimal pl-5">
                        {JSON.parse(recipe.instructions).map((step, index) => (
                            <li key={index} className="text-lg">{step}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    )
}