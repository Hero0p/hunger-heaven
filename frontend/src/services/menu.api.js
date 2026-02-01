import api from './api';

export const addMenuBulk = async (formData) => {
    try {
        const response = await api.post('/food/menu', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
