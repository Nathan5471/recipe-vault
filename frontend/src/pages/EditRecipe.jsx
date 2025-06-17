import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipe, updateRecipe } from '../utils/recipeAPIHandler';
import Navbar from '../components/Navbar';

export default function EditRecipe() {
    const navigate = useNavigate();
    const { recipeId } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: ''}]);
    const [ingredientsLength, setIngredientsLength] = useState(1);
    const [instructions, setInstructions] = useState('');
    const [instructionsLength, setInstructionsLength] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const recipeData = await getRecipe(recipeId);
                setTitle(recipeData.title);
                setDescription(recipeData.description);
                setIngredients(JSON.parse(recipeData.ingredients));
                setInstructions(JSON.parse(recipeData.instructions));
                setIngredientsLength(JSON.parse(recipeData.ingredients).length);
                setInstructionsLength(JSON.parse(recipeData.instructions).length);
            } catch (error) {
                console.error('Error fetching recipe:', error);
                setError('Failed to load recipe data. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchRecipe();
    }, [recipeId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await updateRecipe(recipeId, title, description, JSON.stringify(ingredients), JSON.stringify(instructions));
            if (response) {
                alert('Recipe created successfully!');
                setTitle('');
                setIngredients([{ name: '', quantity: '', unit: '' }]);
                setIngredientsLength(1);
                setInstructions('');
                setInstructionsLength(1);
                setDescription('');
                navigate('/');
            }
        } catch (error) {
            setError(error.message);
        }
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
            <div className="flex flex-col items-center justify-center p-4">
                <div className="bg-white p-4 rounded-lg w-[calc(80%)] mb-6">
                    <h2 className="text-4xl mb-6 text-center">Create Recipe</h2>
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="mb-4">
                            <label className="block text-2xl text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                placeholder="Enter recipe title"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-2xl text-gray-700 mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                placeholder="Enter recipe description"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-2xl text-gray-700 mb-2">Ingredients</label>
                            {Array.from({ length: ingredientsLength }).map((ingredient, index) => (
                                <div key={index} className="flex flex-row w-full mb-1">
                                    <input
                                        type="text"
                                        value={ingredients[index].name || ''}
                                        onChange={(e) => {
                                            const newIngredients = [...ingredients];
                                            newIngredients[index].name = e.target.value;
                                            setIngredients(newIngredients);
                                        }}
                                        className="w-[calc(50%)] p-2 border border-gray-300 rounded-lg"
                                        placeholder={`Ingredient ${index + 1}`}
                                    />
                                    <input
                                        type="text"
                                        value={ingredients[index].quantity || ''}
                                        onChange={(e) => {
                                            const newIngredients = [...ingredients];
                                            newIngredients[index].quantity = e.target.value;
                                            setIngredients(newIngredients);
                                        }}
                                        className="w-[calc(20%)] p-2 border border-gray-300 rounded-lg ml-1"
                                        placeholder="Quantity"
                                    />
                                    <input
                                        type="text"
                                        value={ingredients[index].unit || ''}
                                        onChange={(e) => {
                                            const newIngredients = [...ingredients];
                                            newIngredients[index].unit = e.target.value;
                                            setIngredients(newIngredients);
                                        }}
                                        className="w-[calc(20%)] p-2 border border-gray-300 rounded-lg ml-1"
                                        placeholder="Unit (e.g., grams, cups)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newIngredients = [...ingredients];
                                            newIngredients.splice(index, 1);
                                            setIngredients(newIngredients);
                                            setIngredientsLength(ingredientsLength - 1);
                                        }}
                                        className="ml-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >Delete</button>
                                </div>
                                
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setIngredientsLength(ingredientsLength + 1);
                                    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
                                }}
                                className="mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >Add Ingredient</button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-2xl text-gray-700 mb-2">Instructions</label>
                            {Array.from({ length: instructionsLength }).map((instruction, index) => (
                                <div key={index} className="flex flex-row w-full mb-1">
                                    <textarea
                                        value={instructions[index] || ''}
                                        onChange={(e) => {
                                            const newInstructions = [...instructions];
                                            newInstructions[index] = e.target.value;
                                            setInstructions(newInstructions);
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        placeholder={`Instruction ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newInstructions = [...instructions];
                                            newInstructions.splice(index, 1);
                                            setInstructions(newInstructions);
                                            setInstructionsLength(instructionsLength - 1);
                                        }}
                                        className="ml-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >Delete</button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setInstructionsLength(instructionsLength + 1);
                                    setInstructions([...instructions, '']);
                                }}
                                className="mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >Add Instruction</button>
                        </div>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        <div className="flex flex-row">
                            <button
                                type="submit"
                                className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >Save Edit</button>
                            <button
                                type="button"
                                onClick={() => window.location.href = '/'}
                                className="w-full p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 ml-1"
                            >Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}