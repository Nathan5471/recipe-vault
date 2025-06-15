import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from './authAPIHandler';

export default function AuthenticatedRoute() {
    const [isLoggedIn, setIsLoggedIn] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                await getCurrentUser();
                setIsLoggedIn(true);
            } catch (error) {
                setIsLoggedIn(false);
            }
        }
        fetchUser()
    }, [])
    if (isLoggedIn === null) {
        return null
    }
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
}