import React, { useEffect, useState } from 'react';
import { getAmountOfRecipes, getAllRecipes } from '../utils/recipeAPIHandler';
import RecipeCard from '../components/RecipeCard';
import Navbar from '../components/Navbar';

export default function AllRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderBy, setOrderBy] = useState('recent_desc');
    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await getAllRecipes(limit, orderBy, page);
                const amount = await getAmountOfRecipes('all');
                setRecipes(response);
                setTotalPages(Math.ceil(amount / limit));
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchRecipes();
    }, [limit, orderBy, page]);

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
            <div className="flex flex-row justify-center items-center">
                <p className="ml-auto text-xl">Sort By:</p>
                <select className="m-4 p-2 border rounded" value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
                    <option value="recent_desc">Date (Recent First)</option>
                    <option value="recent_asc">Date (Oldest First)</option>
                    <option value="alphabetical_asc">Alphabetical (A-Z)</option>
                    <option value="alphabetical_desc">Alphabetical (Z-A)</option>
                </select>
                <p className="ml-1 text-xl">Limit:</p>
                <select className="m-4 p-2 border rounded" value={limit} onChange={(e) => setLimit(e.target.value)}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            {recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-xl px-4">
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} startingIsFavorite={true} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">There are no recipes.</p>
            )}
            { totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                        onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                    >
                        Previous
                    </button>
                    <span className="mx-4">Page {page + 1} of {totalPages}</span>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={page >= totalPages - 1}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}