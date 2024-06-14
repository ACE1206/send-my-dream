import axios from "axios";

const API_URL = 'https://space-link.online/api';

const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    return {
        Authorization: `Bearer ${accessToken}`,
    };
};

export const registerUser = async (userData, referral) => {
    const response = await axios.post(`${API_URL}/users/register`, userData, {
        params: {
            referral: referral
        },
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    if (response.status !== 200) {
        throw new Error('Network response was not ok');
    }
    return response.data;
};

export const editUser = async (userData) => {
    const response = await axios.put(`${API_URL}/users`, userData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeaders()
        }
    });
    if (response.status !== 200) {
        throw new Error('Network response was not ok');
    }
    return response.data;
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

export const getUserData = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/credentials`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
};

export const createDream = async (dreamData) => {
    const response = await axios.post(`${API_URL}/products`, dreamData, {
        'Content-Type': 'application/json',
    });
    return response.data;
};

export const updateDream = async (id, dreamData) => {
    const response = await axios.put(`${API_URL}/products/${id}`, dreamData, {
        headers: getAuthHeaders(),
        'Content-Type': 'multipart/form-data',

    });
    return response.data;
};

export const getDreams = async () => {
    const response = await axios.get(`${API_URL}/products`, {
        'Content-Type': 'application/json',
    });
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await axios.post(`${API_URL}/categories`, categoryData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        }
    });
    return response.data;
};

export const updateCategory = async (id, categoryData) => {
    const response = await axios.put(`${API_URL}/categories/${id}`, categoryData, {
        headers: getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
    });
    return response.data;
};

export const getCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
};

export const searchCategories = async (name) => {
    const response = await axios.get(`${API_URL}/categories/search?name=${name}`);
    return response.data;
};

export const getProductsByCategory = async (category) => {
    const response = await axios.get(`${API_URL}/products/get?category=${category}`);
    return response.data;
}

export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/admin/users`, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json',
    });
    return response.data;
};

export const generateImages = async (query) => {
    try {
        const response = await axios.get(`${API_URL}/ai/generate`, {
            params: {query},
        });
        return response.data;
    } catch (error) {
        console.error('Error generating images:', error);
        throw error;
    }
};

export const addProductToBasket = async (product) => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/basket/addProduct`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });
    if (!response.ok) {
        throw new Error('Error adding product to basket');
    }
};

export const getUserProducts = async (status) => {
    const accessToken = localStorage.getItem('accessToken');
    try {
        const response = await axios.get(`${API_URL}/basket/getProducts/${status}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error generating images:', error);
        return [];
    }
};

export const makePurchase = async (purchaseData) => {
    const response = await axios.post(`${API_URL}/purchases`, purchaseData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        }
    });
    return response.data;
};

export const sendProducts = async (products) => {
    const response = await axios.post(`${API_URL}/basket/buyProducts`, products, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
        }
    });
    return response.data;
};

export const checkPromoCode = async (userId, promoCode) => {
    const response = await axios.get(`${API_URL}/users/promoCode/check`, {
        headers: {
            ...getAuthHeaders()
        },
        params: {
            userId: userId,
            promoCode: promoCode
        }
    })
    return response.data
}

export const changePromoCode = async (userId, promoCode) => {
    const response = await axios.get(`${API_URL}/users/promoCode/change`, {
        headers: {
            ...getAuthHeaders()
        },
        params: {
            userId: userId,
            promoCode: promoCode
        }
    })
    return response.data
}
