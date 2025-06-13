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
                {/* TODO: Implement images */}
                <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
                <p className="text-gray-700 mb-4">{recipe.description}</p>
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