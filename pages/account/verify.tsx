import styles from "../../styles/Auth.module.scss";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Header from "../../components/Header/Header";
import MobileMenu from "../../components/Menu/MobileMenu";
import {forgotPassword, loginUser, resetPassword, verifyEmail} from "../../utils/api.js";
import {useRouter} from "next/router";
import {useAuth} from "../../components/Auth/AuthContext";
import Head from "next/head";

const VerifyEmail: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState('');
    const router = useRouter();
    const {isAuthenticated} = useAuth();
    const {token} = router.query;
    const [verified, setVerified] = useState<boolean>(false)

    useEffect(() => {
        handleVerify()
    }, [token]);

    const handleVerify = async () => {
        if (token === null) {
            router.push('/')
        } else {
            try {
                await verifyEmail(token);
                setVerified(true)
            } catch (error) {
                console.error('Ошибка при изменении пароля:', error);
            }
        }
    };

    return (
        <div className={styles.login}>
            <Head>
                <title>Verify email</title>
            </Head>
            <Header/>
            <section className={styles.container}>
                <div className={styles.title}>
                    <h1>Your email is verified now!</h1>
                </div>
                <Link href={'/account'}>Go back</Link>
            </section>
            <MobileMenu/>
        </div>
    );
};

export default VerifyEmail;
