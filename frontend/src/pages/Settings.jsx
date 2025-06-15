import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOverlayContext } from '../contexts/OverlayContext';
import { getCurrentUser, logout } from '../utils/authAPIHandler';
import Navbar from '../components/Navbar';
import EditUsername from '../components/EditUsername'
import EditPassword from '../components/EditPassword'
import DeleteAccount from '../components/DeleteAccount'

export default function Settings() {
    const navigate = useNavigate();
    const { openOverlay } = useOverlayContext();
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

    const handleEditUsername = (e) => {
        e.preventDefault();
        openOverlay(<EditUsername />)
    }

    const handleEditPassword = (e) => {
        e.preventDefault();
        openOverlay(<EditPassword />)
    }

    const handleDeleteAccount = (e) => {
        e.preventDefault();
        openOverlay(<DeleteAccount />)
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        navigate('/login')
    }

    const handleManageAccounts = (e) => {
        e.preventDefault();
        navigate('/manageAccounts');
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
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl mt-2">Settings</h1>
                <div className="bg-white p-4 mt-4 w-[calc(35%)] rounded-lg">
                    <h2 className="text-2xl">Account Settings</h2>
                    <div className="flex flex-row mt-2 justify-between">
                        <p className="text-lg">Username: {user.username}</p>
                        <button
                            type="button"
                            className="w-[calc(35%)] bg-blue-500 p-2 rounded-lg text-lg text-white hover:bg-blue-600"
                            onClick={handleEditUsername}
                        >Edit Username</button>
                    </div>
                    <button
                        type="button"
                        className="w-full bg-blue-500 p-2 mt-2 rounded-lg text-lg text-white hover:bg-blue-600"
                        onClick={handleEditPassword}
                    >Edit Password</button>
                    <button
                        type="button"
                        className="w-full bg-blue-500 p-2 mt-2 rounded-lg text-lg text-white hover:bg-blue-600"
                        onClick={handleLogout}
                    >Logout</button>
                    <button
                        type="button"
                        className="w-full bg-red-500 p-2 mt-2 rounded-lg text-lg text-white hover:bg-red-600"
                        onClick={handleDeleteAccount}
                    >Delete Account</button>
                </div>
                {user.account_type === 'admin' && <div className="bg-white p-4 mt-4 w-[calc(35%)] rounded-lg">
                    <h2 className="text-2xl">Admin Settings</h2>
                    <button
                        type="button"
                        className="w-full bg-blue-500 p-2 mt-2 rounded-lg text-lg text-white hover:bg-blue-600"
                        onClick={handleManageAccounts}
                    >Manage Accounts</button>
                </div>}
            </div>
        </div>
    )
}