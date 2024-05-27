import axios from "axios";

const API_URL = 'http://localhost:8000';

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
    const response = await axios.post(`${API_URL}/token/`, userData);
    if (response.status !== 200) {
        throw new Error('Network response was not ok');
    }
    return response.data;
};

export const getUserData = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/users/${id}/`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
};
