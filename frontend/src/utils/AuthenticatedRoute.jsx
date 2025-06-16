import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from './authAPIHandler';

export default function AuthenticatedRoute({ allowedAccountTypes = ['user', 'admin']}) {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response);
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
    if (isLoggedIn && allowedAccountTypes.includes(user.account_type)) {
        return <Outlet />
    } else if (isLoggedIn) {
        return <Navigate to="/" />
    } else {
        return <Navigate to="/login" />
    }
}