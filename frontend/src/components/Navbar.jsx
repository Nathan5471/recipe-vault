import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">
                    <Link to="/" className="text-white hover:text-gray-200">MyApp</Link>
                </h1>
                <input
                    type="text"
                    placeholder="Search recipes..."
                    className="p-2 bg-white rounded-lg border border-gray-300 w-[calc(50%)]"
                />
                <div className="flex space-x-4">
                    <Link to="/myrecipes" className="text-white hover:text-gray-200">My Recipes</Link>
                    <Link to="/profile" className="text-white hover:text-gray-200">Profile</Link>
                </div>
            </div>
        </nav>
    )
}