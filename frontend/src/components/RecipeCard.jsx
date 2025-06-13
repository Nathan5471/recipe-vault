import React from 'react';
import { Link } from 'react-router-dom';
import { FcLike, FcLikePlaceholder } from "react-icons/fc";

export default function RecipeCard({ recipe }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <Link to={`/recipe/${recipe.id}`}>
                {/* TODO: Implement images */}
                <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
                <p className="text-gray-700 mb-4">{recipe.description}</p>
                <div className="flex flex-row justify-between items-center">
                    <p className="text-gray-400">By ADD NAMES</p>
                    <button>
                        <FcLike />
                    </button>
                </div>
            </Link>
        </div>
    )
}