import React, { useEffect, useState } from 'react';
import { getAllUsers, editAccountType } from '../utils/authAPIHandler';
import { useOverlayContext } from '../contexts/OverlayContext';
import Navbar from '../components/Navbar';
import DeleteAccountAdmin from '../components/DeleteAccountAdmin';

export default function ManageAccounts() {
    const { openOverlay } = useOverlayContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response)
            } catch (error) {
                console.error('Error fetching all users', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAllUsers();
    }, []);

    const handleAccountTypeChange = async (userIndex, newAccountType) => {
        try {
            const response = await editAccountType(users[userIndex].id, newAccountType);
            if (response) {
                setUsers(prevUsers => {
                    const updatedUser = [...prevUsers];
                    updatedUser[userIndex].account_type = newAccountType;
                    return updatedUser;
                })
            }
        } catch (error) {
            console.error('Error updating account type', error);
        }
    }

    const handleDeleteAccount = (e, userId, username, index) => {
        e.preventDefault();
        openOverlay(
            <DeleteAccountAdmin
                userId={userId}
                username={username}
                index={index}
                onDelete={(index) => {
                    setUsers(prevUsers => prevUsers.filter((_, i) => i !== index));
                }}
            />
        );
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
        <div className="flex flex-col bg-gray-100 h-screen">
            <Navbar />
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-3xl">Manage Accounts</h1>
                {users.length > 0 ? (
                    <div className="mt-4 w-[calc(50%)]">
                        {users.map((user, index) => (
                            <div key={user.id} className="flex flex-row bg-white p-4 rounded-lg mb-2">
                                <p className="text-xl">{user.username}</p>
                                <div className="ml-auto">
                                    <select id="accountType" classsName="bg-gray-200 p-2 rounded-lg" value={user.account_type} onChange={(e) => handleAccountTypeChange(index, e.target.value)}>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <button className="ml-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600" onClick={(e) => handleDeleteAccount(e, user.id, user.username, index)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-lg">No users found.</p>
                )}
            </div>
        </div>
    )
}