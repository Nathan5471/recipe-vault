import axios from 'axios';

const api = axios.create({
    baseURL: 'api/auth',
    withCredentials: true,
})

api.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error.response ? error.response.data : 'Network Error');
    }
);

export const register = async (username, password) => {
    const response = await api.post('/register', { username, password });
    if (response.status === 201) {
        return response.data;
    }
}

export const login = async (username, password) => {
    const response = await api.post('/login', { username, password });
    if (response.status === 200) {
        return response.data;
    }
}

export const logout = async () => {
    const response = await api.post('/logout');
    if (response.status === 200) {
        return response.data;
    }
}

export const editUsername = async (newUsername) => {
    const response = await api.put('/update', {toUpdate: 'username', newUsername})
    if (response.status === 200) {
        return response.data;
    }
}

export const editPassword = async (newPassword) => {
    const response = await api.put('/update', {toUpdate: 'password', newPassword})
    if (response.status === 200) {
        return response.data
    }
}

export const deleteUser = async () => {
    const response = await api.delete('/delete')
    if (response.status === 200) {
        return response.data
    }
}

export const getCurrentUser = async () => {
    const response = await api.get('/');
    if (response.status === 200) {
        return response.data;
    }
}