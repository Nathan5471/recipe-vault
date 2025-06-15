import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../utils/authAPIHandler';
import Navbar from '../components/Navbar';

export default function Settings() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
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
                <h1 className="text-4xl mt-2">Settings</h1>
                <div className="bg-white p-4 mt-4 w-[calc(35%)] rounded-lg">
                    <h2 className="text-2xl">Display Settings</h2>
                    <button
                        type="button"
                        className="w-full bg-blue-500 p-2 mt-2 rounded-lg text-lg text-white hover:bg-blue-600"
                    >Toggle Theme</button>
                </div>
                <div className="bg-white p-4 mt-4 w-[calc(35%)] rounded-lg">
                    <h2 className="text-2xl">Account Settings</h2>
                    <div className="flex flex-row mt-2 justify-between">
                        <p className="text-lg">Username: {user.username}</p>
                        <button
                            type="button"
                            className="w-[calc(35%)] bg-blue-500 p-2 rounded-lg text-lg text-white hover:bg-blue-600"
                        >Edit Username</button>
                    </div>
                    <button
                        type="button"
                        className="w-full bg-blue-500 p-2 mt-2 rounded-lg text-lg text-white hover:bg-blue-600"
                    >Edit Password</button>
                    <button
                        type="button"
                        className="w-full bg-blue-500 p-2 mt-2 rounded-lg text-lg text-white hover:bg-blue-600"
                    >Logout</button>
                    <button
                        type="button"
                        className="w-full bg-red-500 p-2 mt-2 rounded-lg text-lg text-white hover:bg-red-600"
                    >Delete Account</button>
                </div>
                {user.account_type === 'admin' && <div className="bg-white p-4 mt-4 w-[calc(35%)] rounded-lg">
                    <h2 className="text-2xl">Admin Settings</h2>
                    <button
                        type="button"
                        className="w-full bg-blue-500 p-2 mt-2 rounded-lg text-lg text-white hover:bg-blue-600"
                    >Manage Accounts</button>
                </div>}
            </div>
        </div>
    )
}