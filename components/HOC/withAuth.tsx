import React, { ComponentType, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../Auth/AuthContext';
import axios from 'axios';
import AuthModal from "../Modal/AuthModal";
import {AuthModalProvider, useAuthModal} from "../Auth/AuthModalContext";


const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {

    const WithAuthComponent: React.FC<P> = (props) => {
        const { isAuthenticated, logout } = useAuth();
        const router = useRouter();
        const [authChecked, setAuthChecked] = useState(false);
        const [isAdmin, setIsAdmin] = useState(false);
        const { isAuthModalOpen, openAuthModal, closeAuthModal } = useAuthModal();

        useEffect(() => {
            const token = getAuthorizationTokenFromUrl();
            if (token && router.pathname.includes('/account/edit')) {
                localStorage.setItem('accessToken', token);
                setAuthChecked(true);
            } else {
                checkAuth();
            }
        }, [isAuthenticated]);

        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                logout();
                return;
            }

            try {
                const validateResponse = await axios.get(`${API_URL}/users/validate`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (validateResponse.status === 200) {
                    if (router.pathname.startsWith('/administrator')) {
                        const credentialsResponse = await axios.get(`${API_URL}/users/credentials`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        });

                        if (credentialsResponse.status === 200) {
                            const userType = credentialsResponse.data.type;
                            setIsAdmin(userType === 'ADMIN');
                            if (userType !== 'ADMIN') {
                                closeAuthModal()
                                router.replace('/');
                                return;
                            }
                        }
                    }
                    setAuthChecked(true);
                }
            } catch (error) {
                logout();
            }
        };

        const getAuthorizationTokenFromUrl = () => {
            const token = new URLSearchParams(window.location.search).get('token');
            if (token) {
                return token;
            }
            return null;
        };

        // if (!authChecked) {
        //     return <div>Loading...</div>;
        // }

        if (isAuthModalOpen) {
            return <AuthModal onClose={() => router.push("/")} />;
        }

        return <WrappedComponent {...props} />;
    };

    return WithAuthComponent;
};

export default withAuth;
