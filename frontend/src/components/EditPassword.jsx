import React, { useState } from 'react';
import { editPassword } from '../utils/authAPIHandler';
import { useOverlayContext } from '../contexts/OverlayContext';

export default function EditPassword() {
    const { closeOverlay } = useOverlayContext();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleEdit = async () => {
        setError('')
        try {
            if (password.trim() === '') {
                setError('Please enter a password')
                return;
            }
            await editPassword(password);
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
            <h1 className="text-4xl text-center">Edit Password</h1>
            <p className="text-xl mt-2">New Password</p>
            <input
                type="password"
                className="w-full border border-gray-300 p-2 rounded-lg"
                onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-red-500">{error}</p>
            <div className="flex flex-row mt-2">
                <button className="w-full p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg" onClick={handleEdit}>Save</button>
                <button className="w-full p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg ml-1" onClick={handleCancel}>Cancel</button>
            </div>
            
        </div>
    )
}