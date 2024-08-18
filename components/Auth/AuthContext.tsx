// Контекст авторизации

import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';
import {useAuthModal} from "./AuthModalContext";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (accessToken: string) => void;
    logout: () => void;
    refreshAuth: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [previousUrl, setPreviousUrl] = useState<string | null>(null);
    const router = useRouter();
    const {closeAuthModal} = useAuthModal()

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            const currentUrl = window.location.href;
            sessionStorage.setItem('previousUrl', currentUrl);
        };

        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router.events]);

    useEffect(() => {
        const savedPreviousUrl = sessionStorage.getItem('previousUrl');
        setPreviousUrl(savedPreviousUrl);
        const token = getAuthorizationTokenFromUrl();
        if (token && router.pathname.includes("/account/edit")) {
            localStorage.setItem('accessToken', token);
            setIsAuthenticated(true);
            closeAuthModal()
            router.replace('/account/edit');
        } else {
            validateAuth();
        }
    }, []);

    const validateAuth = async () => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            try {
                await axios.get(`${API_URL}/users/validate`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setIsAuthenticated(true);
            } catch (e) {
                setIsAuthenticated(false);
            }
        }
    }

    const refreshAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await axios.get(`${API_URL}/users/validate`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                localStorage.removeItem('accessToken');
                setIsAuthenticated(false);
                closeAuthModal()
                router.push('/account/login');
            }
        }
    };

    const getAuthorizationTokenFromUrl = () => {
        const token = new URLSearchParams(window.location.search).get('token');
        if (token) {
            return token;
        }
        return null;
    };

    const login = (accessToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        setIsAuthenticated(true);

        const reverseRedirect = previousUrl && (previousUrl.includes('/boutique') || previousUrl.includes('/create'));

        reverseRedirect ? router.push(previousUrl || '/account') : router.push('/account');
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
        closeAuthModal()
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, login, logout, refreshAuth}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
