import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AuthModal from "../Modal/AuthModal";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (accessToken: string) => void;
    logout: () => void;
    refreshAuth: () => Promise<void>;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    isAuthModalOpen: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const router = useRouter();

    // Открытие и закрытие модального окна
    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);

    // Проверка токена авторизации при монтировании
    useEffect(() => {
        validateAuth();
    }, []);

    const validateAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                await axios.get(`${API_URL}/users/validate`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            }
        }
    };

    const refreshAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await axios.get(`${API_URL}/users/validate`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                }
            } catch {
                localStorage.removeItem('accessToken');
                setIsAuthenticated(false);
                closeAuthModal();
                router.push('/account/login');
            }
        }
    };

    const login = (accessToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        setIsAuthenticated(true);
        closeAuthModal();
        router.push('/account');
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        closeAuthModal();
        router.push('/');
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                logout,
                refreshAuth,
                openAuthModal,
                closeAuthModal,
                isAuthModalOpen,
            }}
        >
            {children}
            {isAuthModalOpen && <AuthModal onClose={closeAuthModal} />}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
