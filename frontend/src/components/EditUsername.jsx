import React, { useState } from 'react';
import { editUsername } from '../utils/authAPIHandler';
import { useOverlayContext } from '../contexts/OverlayContext';

export default function EditUsername() {
    const { closeOverlay } = useOverlayContext();
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleEdit = async () => {
        setError('')
        try {
            if (username.trim() === '') {
                setError('Please enter a username')
                return;
            }
            await editUsername(username);
            closeOverlay();
            window.location.reload();
        } catch (error) {
            setError(error.message)
        }
    }

    const handleCancel = () => {
        closeOverlay();
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-4xl text-center">Edit Username</h1>
            <p className="text-xl mt-2">New Username</p>
            <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded-lg"
                onChange={(e) => setUsername(e.target.value)}
            />
            <p className="text-red-500">{error}</p>
            <div className="flex flex-row mt-2">
                <button className="w-full p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg" onClick={handleEdit}>Save</button>
                <button className="w-full p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg ml-1" onClick={handleCancel}>Cancel</button>
            </div>
            
        </div>
    )
}