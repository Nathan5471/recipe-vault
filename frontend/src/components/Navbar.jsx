import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoSearch } from "react-icons/go";

export default function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() === '') {
            alert('Please enter a search query');
            return;
        }
        navigate(`/search/${encodeURIComponent(searchQuery.trim())}`);
    }

    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    <Link to="/" className="text-white hover:text-gray-200">Recipe Vault</Link>
                </h1>
                <div className="flex flex-row w-[calc(50%)]">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(e);
                            }
                        }}
                        placeholder="Search recipes..."
                        className="p-2 bg-white rounded-lg border border-gray-300 w-[calc(95%)] mr-1"
                    />
                    <button className="p-2 bg-white rounded-lg hover:bg-gray-200" onClick={handleSearch}>
                        <GoSearch />
                    </button>
                </div>
                <div className="flex space-x-4">
                    <Link to="/create" className="text-white hover:text-gray-200">Create Recipe</Link>
                    <Link to="/myrecipes" className="text-white hover:text-gray-200">My Recipes</Link>
                    <Link to="/settings" className="text-white hover:text-gray-200">Settings</Link>
                </div>
            </div>
        </nav>
    )
}