import axios from "axios";

const API_URL = 'http://localhost:8000';

const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    return {
        Authorization: `Bearer ${accessToken}`,
    };
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/token/`, userData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.status !== 200) {
        throw new Error('Network response was not ok');
    }
    return response.data;
};

export const getUserData = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/users/${id}/`, {
            headers: getAuthHeaders(),
            'Content-Type': 'application/json',
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
};

export const createDream = async (dreamData) => {
    const response = await axios.post(`${API_URL}/dream/dream/create/`, dreamData, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json',
    });
    return response.data;
};

export const updateDream = async (id, dreamData) => {
    const response = await axios.put(`${API_URL}/dream/dream/update/${id}/`, dreamData, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json',
    });
    return response.data;
};

export const getDreams = async () => {
    const response = await axios.get(`${API_URL}/dream/dream/`, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json',
    });
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await axios.post(`${API_URL}/dream/dream_category/create/`, categoryData, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json',
    });
    return response.data;
};

export const updateCategory = async (id, categoryData) => {
    const response = await axios.put(`${API_URL}/dream/dream_category/update/${id}/`, categoryData, {
        headers: getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
    });
    return response.data;
};

export const getCategories = async () => {
    const response = await axios.get(`${API_URL}/dream/dream_category/`, {
        headers: getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
    });
    return response.data;
};
