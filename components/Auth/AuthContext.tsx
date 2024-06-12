import React, {createContext, useContext, useEffect, useState, ReactNode} from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';

const API_URL = 'https://space-link.online/api';

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
        validateAuth()
    }, []);

    const validateAuth = async () => {
        const accessToken = localStorage.getItem('accessToken');

        try {
            await axios.get(`${API_URL}/users/validate`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setIsAuthenticated(true)
        } catch (e) {
            setIsAuthenticated(false)
        }
    }

    const refreshAuth = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            try {
                const response = await axios.get(`${API_URL}/users/validate`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                localStorage.removeItem('accessToken');
                setIsAuthenticated(false);
                router.push('/account/login');
            }
        }
    };

    const login = (accessToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        setIsAuthenticated(true);

        const reverseRedirect = previousUrl && !previousUrl.includes('/account') && !previousUrl.includes('/administrator');

        reverseRedirect ? router.push(previousUrl || '/') : router.push('/account');
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
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
