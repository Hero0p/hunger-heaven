import api from './api';

export const getComments = async (contentId, page = 1, limit = 10) => {
    try {
        const response = await api.get(`/food/${contentId}/comments?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const postComment = async (contentId, text) => {
    try {
        const response = await api.post(`/food/${contentId}/comment`, { text });
        return response.data;
    } catch (error) {
        throw error;
    }
};
