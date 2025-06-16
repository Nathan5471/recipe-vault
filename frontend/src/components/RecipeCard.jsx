import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { addRemoveFavorite } from '../utils/recipeAPIHandler';

export default function RecipeCard({ recipe, startingIsFavorite }) {
    const [isFavorite, setIsFavorite] = useState(startingIsFavorite);

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const newFavoriteList = await addRemoveFavorite(recipe.id);
            setIsFavorite(newFavoriteList.favoriteRecipes.includes(recipe.id));
        } catch (error) {
            console.error('Error toggling favorite:', error);
            alert('Failed to update favorite status. Please try again.');
        }
    }
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <Link to={`/recipe/${recipe.id}`}>
                <img
                    src={`${window.location.origin}/images/${recipe.image_url}`}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
                <div className="flex flex-row justify-between items-center">
                    <p className="text-gray-400">By ADD NAMES</p>
                    <button
                        onClick={handleToggleFavorite}
                    >
                        {isFavorite ? <FcLike /> : <FcLikePlaceholder />}
                    </button>
                </div>
            </Link>
        </div>
    )
}