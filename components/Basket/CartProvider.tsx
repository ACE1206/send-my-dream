// Счетчик "корзины"

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { countBasketProducts } from "../../utils/api";
import { useAuth } from "../Auth/AuthContext";

interface CartContextProps {
    countProducts: number;
    addProductToCart: () => void;
    removeProductFromCart: (count: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [countProducts, setCountProducts] = useState(0);
    const { isAuthenticated } = useAuth();

    const countAddedProducts = async () => {
        const count = await countBasketProducts();
        setCountProducts(count);
    };

    useEffect(() => {
        if (isAuthenticated) {
            countAddedProducts();
        } else {
            clearCart()
        }
    }, [isAuthenticated]);

    const addProductToCart = () => {
        countAddedProducts()
    };

    const removeProductFromCart = (count: number) => {
        countAddedProducts()
    };

    const clearCart = () => {
        setCountProducts(null)
    };

    const value = {
        countProducts,
        addProductToCart,
        removeProductFromCart,
        clearCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
