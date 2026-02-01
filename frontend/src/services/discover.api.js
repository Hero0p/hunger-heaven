import api from './api';

export const getRestaurants = async (page = 1, limit = 10) => {
    try {
        const response = await api.get(`/discover?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
