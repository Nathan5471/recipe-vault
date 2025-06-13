import axios from 'axios';

const api = axios.create({
    baseURL: 'api/recipes',
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error.response ? error.response.data : 'Network Error');
    }
);

export const createRecipe = async (title, ingredients, instructions, description) => {
    const response = await api.post('/create', {
        title,
        ingredients,
        instructions,
        description
    });
    if (response.status === 201) {
        return response.data;
    }
}

export const getUserRecipes = async (userId) => {
    const response = await api.get(`/user/${userId}`);
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