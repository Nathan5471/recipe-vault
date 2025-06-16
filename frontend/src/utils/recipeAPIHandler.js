import axios from 'axios';

const baseURL = window.location.origin

const api = axios.create({
    baseURL: `${baseURL}/api/recipes`,
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error.response ? error.response.data : 'Network Error');
    }
);

export const createRecipe = async (formData) => {
    const response = await api.post('/create', formData);
    if (response.status === 201) {
        return response.data;
    }
}

export const getAmountOfRecipes = async (type, userId) => {
    if (type === 'all') {
        const response = await api.get('/amount', { params: { type } });
        if (response.status === 200) {
            return response.data;
        }
    } else {
        const response = await api.get(`/amount/${type}`, { params: { userId } });
        if (response.status === 200) {
            return response.data;
        }
    }
}

export const getAllRecipes = async (limit = 100, sortBy = 'recent_desc', page=0) => {
    const response = await api.get(`/all`, { params: { limit, sortBy, page } });
    if (response.status === 200) {
        return response.data;
    }
}

export const getUserRecipes = async (userId) => {
    const response = await api.get(`/user/${userId}`);
    if (response.status === 200) {
        return response.data;
    }
}

export const searchRecipes = async (query) => {
    console.log('Searching for recipes with query:', query);
    const response = await api.get(`/search/${query}`);
    console.log('Search response:', response);
    if (response.status === 200) {
        return response.data;
    }
}

export const getFavorites = async () => {
    const response = await api.get('/favorites');
    if (response.status === 200) {
        return response.data;
    }
}

export const addRemoveFavorite = async (recipeId) => {
    const response = await api.post('/addRemoveFavorite', {recipeId});
    if (response.status === 200) {
        return response.data;
    }
}