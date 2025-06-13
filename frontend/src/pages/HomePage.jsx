import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function HomePage() {
    return (
        <div className="flex flex-col bg-gray-100 min-h-screen">
            <Navbar />
            <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-4 rounded-lg w-[calc(80%)]">
                    <h2 className="text-4xl mb-6">Favorite Recipes</h2>
                </div>
                <div className="bg-white p-4 rounded-lg w-[calc(80%)] mt-6">
                    <h2 className="text-4xl mb-6">My Recipes</h2>
                </div>
                <div className="bg-white p-4 rounded-lg w-[calc(80%)] mt-6">
                    <h2 className="text-4xl mb-6">Recent Recipes</h2>
                </div>
            </div>
        </div>
    )
}