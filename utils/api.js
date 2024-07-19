import axios from "axios";

const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken ? {
        Authorization: `Bearer ${accessToken}`,
    } : null;
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
    if (getAuthHeaders()) {
        try {
            const response = await axios.get(`${API_URL}/users/credentials`, {
                headers: getAuthHeaders(),
            });
            return response.data;
        } catch (error) {
            return null
        }
    } else {
        return null
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
    try {
        const response = await axios.get(`${API_URL}/products`, {
            'Content-Type': 'application/json',
        });
        return response.data;
    } catch (e) {
        return []
    }
};

export const deleteDream = async (id) => {
    const response = await axios.put(`${API_URL}/products/delete/${id}`, {}, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await axios.put(`${API_URL}/categories/delete/${id}`, {}, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const createCategory = async (categoryData) => {
    const response = await axios.post(`${API_URL}/categories`, categoryData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
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
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    } catch (e) {
        return []
    }
};

export const searchCategories = async (name) => {
    const response = await axios.get(`${API_URL}/categories/search?name=${name}`);
    return response.data;
};

export const getProductsByCategory = async (category) => {
    try {
        const response = await axios.get(`${API_URL}/products/get?category=${category}`);
        return response.data;
    } catch (e) {
        return []
    }
}

export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/admin/users`, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json',
    });
    return response.data;
};

export const generateImage = async (query, model, price, userId) => {
    try {
        const response = await axios.get(`${API_URL}/ai/generate`, {
            params: {
                query,
                model,
                price,
                userId
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error generating images:', error);
        throw error;
    }
};

export const addProductToBasket = async (product) => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_URL}/basket/addProduct`, product, {
        headers: getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
    });
    return response.data;
};

export const deleteProductFromBasket = async (id) => {
    const response = await axios.delete(`${API_URL}/basket/${id}`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const deleteProductsFromBasket = async (ids) => {
    const response = await axios.delete(`${API_URL}/basket/delete`, {
        data: ids,
        headers: getAuthHeaders()
    });
    return response.data;
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

export const getPurchases = async () => {
    const response = await axios.get(`${API_URL}/admin/purchases`, {
        headers: getAuthHeaders()
    })
    return response.data
}

export const getPartners = async () => {
    const response = await axios.get(`${API_URL}/admin/partners`, {
        headers: getAuthHeaders()
    })
    return response.data
}

export const addCompletedDream = async (dream) => {
    const response = await axios.post(`${API_URL}/completed`, dream, {
        headers: getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
    })
    return response.data
}

export const getCompletedDreams = async (status) => {
    try {
        const response = await axios.get(`${API_URL}/completed`, {
            params: {status},
        })
        return response.data
    } catch (e) {
        return []
    }
}

export const setCompletedDreamStatus = async (id, status) => {
    const response = await axios.put(`${API_URL}/completed/${id}`, status, {
        headers: getAuthHeaders(),
    })
    return response.data
}

export const getProductsByIds = async (ids) => {
    const response = await axios.post(`${API_URL}/products/get-products`, ids, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export const checkIfExistsInBasket = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/basket/check/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (e) {
        return false;
    }
};


export const getPartner = async (id) => {
    const response = await axios.get(`${API_URL}/partners/${id}`, {
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const getPartnerByUserId = async (userId) => {
    const response = await axios.get(`${API_URL}/partners/get-by-user`, {
        params: {userId},
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const registerPartner = async (partnerData) => {
    await axios.post(`${API_URL}/partners`, partnerData, {
        headers: getAuthHeaders(),
    });
};

export const getPartnerPurchases = async (partnerId) => {
    const response = await axios.get(`${API_URL}/purchases/get-by-partner`, {
        params: {partnerId},
        headers: getAuthHeaders(),
    });
    return response.data;
};

export const blockUser = async (id, isBlocked) => {
    const response = await axios.put(`${API_URL}/users/block/${id}`, {}, {
        params: {isBlocked},
        headers: getAuthHeaders(),
    });
    return response.data;
};


export const updatePartner = async (id, partnerData) => {
    const response = await axios.put(`${API_URL}/admin/partners/${id}`, partnerData, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json'
    });
    return response.data;
};


export const getBackgrounds = async () => {
    try {
        const response = await axios.get(`${API_URL}/backgrounds`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (e) {
        return []
    }
};

export const generateLink = async (id) => {
    const response = await axios.get(`${API_URL}/products/generate-link/${id}`, {
        headers: getAuthHeaders()
    });
    return await response.data;
};

export const getBasketById = async (id) => {
    const response = await axios.get(`${API_URL}/basket/id/${id}`);
    return await response.data;
};

export const getBasketByProductId = async (productId) => {
    const response = await axios.get(`${API_URL}/basket/${productId}`, {
        headers: getAuthHeaders()
    })
    return response.data
}

export const makePayment = async (userId, coins, generations, sum, promoCode, payment) => {
    console.error(getAuthHeaders())
    const response = await axios.post(`${API_URL}/payment/pay`, null, {
        params: {
            userId,
            coins,
            generations,
            sum,
            promoCode,
            payment,
        },
        headers: getAuthHeaders()
    });
    return response.data
}

export const getQuotes = async () => {
    try {
        const response = await axios.get(`${API_URL}/quotes`)
        return response.data
    } catch (e) {
        return []
    }
}

export const deleteQuotes = async (id) => {
    const response = await axios.delete(`${API_URL}/quotes/${id}`, {
        headers: getAuthHeaders()
    })
    return response.data
}

export const addQuote = async (quote) => {
    const response = await axios.post(`${API_URL}/quotes`, quote, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json'
    })
    return response.data
}

export const editQuote = async (quote) => {
    const response = await axios.put(`${API_URL}/quotes`, quote, {
        headers: getAuthHeaders(),
        'Content-Type': 'application/json'
    })
    return response.data
}

export const getPayouts = async () => {
    const response = await axios.get(`${API_URL}/payout`, {
        headers: getAuthHeaders(),
    })
    return response.data
}

export const checkPayout = async (id) => {
    const response = await axios.get(`${API_URL}/payout/${id}`, {
        headers: getAuthHeaders(),
    })
    return response.data
}

export const createPayout = async (destination, amount, country, partnerId, payment) => {
    const response = await axios.post(`${API_URL}/payout`, null, {
        params: {
            destination,
            amount,
            country,
            partnerId,
            payment
        },
        headers: getAuthHeaders(),
    })
    return response.data
}

export const payToPartner = async (partnerId) => {
    const response = await axios.post(`${API_URL}/payment/payout`, null, {
        params: {
            partnerId
        },
        headers: getAuthHeaders(),
    })
    return response.data
}

export const getAiProducts = async (userId) => {
    const response = await axios.get(`${API_URL}/products/ai/${userId}`, {
        headers: getAuthHeaders(),
    })
    return response.data
}

export const buyGenerations = async (data) => {
    const response = await axios.put(`${API_URL}/purchases/buy-generations`, data, {
        headers: getAuthHeaders(),
    })
    return response.data
}

export const countBasketProducts = async () => {
    const headers = getAuthHeaders();
    if (!headers) return null;
    try {
        const {data} = await axios.get(`${API_URL}/basket/count`, {headers});
        return data;
    } catch (e) {
        return null;
    }
};

export const sendEmail = async (tableData) => {
    const response = await axios.post(`${API_URL}/email/sendEmail`, tableData, {
        headers: getAuthHeaders()
    });
    return response;
};

export const checkIfRequestedPayment = async (partnerId) => {
    const response = await axios.get(`${API_URL}/payment/check/${partnerId}`, {
        headers: getAuthHeaders()
    });
    return response.data;
};
