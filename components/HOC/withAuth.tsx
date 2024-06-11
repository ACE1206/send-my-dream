import React, {ComponentType, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useAuth} from '../Auth/AuthContext';
import axios from 'axios';
import AuthModal from "../Modal/AuthModal";

const API_URL = 'https://space-link.online/api';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {

    const WithAuthComponent: React.FC<P> = (props) => {
        const [authModalOpen, setAuthModalOpen] = useState(false)
        const {isAuthenticated, logout, login, refreshAuth} = useAuth();
        const router = useRouter();
        const [authChecked, setAuthChecked] = useState(false);

        const checkAuth = async () => {
            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                logout();
                setAuthModalOpen(true)
                return;
            }

            try {
                await axios.get(`${API_URL}/users/validate`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setAuthChecked(true);
            } catch (error) {
                logout();
                setAuthModalOpen(true)
            }
        };

        useEffect(() => {
            checkAuth();
        }, [isAuthenticated]);

        if (!authChecked) {
            return <div>Loading...</div>;
        }

        if (authModalOpen) {
            return <AuthModal onClose={() => router.push("/")}/>
        }

        return <WrappedComponent {...props} />;
    };

    return WithAuthComponent;
};

export default withAuth;
