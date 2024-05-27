import React, { ComponentType, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {useAuth} from "../Auth/AuthContext";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const WithAuthComponent: React.FC<P> = (props) => {
        const { isAuthenticated } = useAuth();
        const router = useRouter();
        const [authChecked, setAuthChecked] = useState(false);

        useEffect(() => {
            if (typeof window !== 'undefined') {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    router.replace('/account/login');
                } else {
                    setAuthChecked(true);
                }
            }
        }, [isAuthenticated, router]);

        if (!authChecked) {
            return <div>Loading...</div>;
        }

        return <WrappedComponent {...props} />;
    };

    return WithAuthComponent;
};

export default withAuth;
