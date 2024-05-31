import axios from "axios";
import category from "../components/Category/Category";

const API_URL = 'https://space-link.online/api';

const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    return {
        Authorization: `Bearer ${accessToken}`,
    };
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
};

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/users/login`, userData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.status !== 200) {
        throw new Error('Network response was not ok');
    }
    return response.data;
};

export const getUserData = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/users/${username}`, {
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
    const response = await axios.post(`${API_URL}/products`, dreamData, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json',
    });
    return response.data;
};

export const updateDream = async (id, dreamData) => {
    const response = await axios.put(`${API_URL}/dream/dream/update/${id}`, dreamData, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json',
    });
    return response.data;
};

export const getDreams = async () => {
    const response = await axios.get(`${API_URL}/products`, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json',
    });
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await axios.post(`${API_URL}/categories`, categoryData, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json',
    });
    return response.data;
};

export const updateCategory = async (id, categoryData) => {
    const response = await axios.put(`${API_URL}/dream/dream_category/update/${id}`, categoryData, {
        headers: getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
    });
    return response.data;
};

export const getCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const searchCategories = async (name) => {
    const response = await axios.get(`${API_URL}/categories/search?name=${name}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const getProductsByCategory = async (category) => {
    const response = await axios.get(`${API_URL}/products/get?category=${category}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
}

export const getUser = async (username) => {
    const response = await axios.get(`${API_URL}/users/${username}`, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json',
    });
    return response.data;
}

export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/admin/users`, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json',
    });
    return response.data;
};
