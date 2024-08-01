import styles from "../../styles/Auth.module.scss";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Header from "../../components/Header/Header";
import MobileMenu from "../../components/Menu/MobileMenu";
import {forgotPassword, loginUser} from "../../utils/api.js";
import {useRouter} from "next/router";
import {useAuth} from "../../components/Auth/AuthContext";
import Head from "next/head";

const Recover: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const {login, isAuthenticated} = useAuth();

    useEffect(() => {
        if(isAuthenticated) {
            router.replace("/account")
        }
    }, [isAuthenticated]);

    const handleRecover = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setError("Password reset link sent.");
        } catch (error) {
            setError("Invalid email");
            console.error(error);
        }
    }

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    return (
        <div className={styles.login}>
            <Head>
                <title>Recover</title>
            </Head>
            <Header/>
            <section className={styles.container}>
                <div className={styles.title}>
                    <h1>Password recovery</h1>
                    <p>Enter your email and a password recovery link will be sent to it</p>
                </div>
                <form onSubmit={handleRecover}>
                    <label className={styles.email}>
                        <input
                            type="email"
                            placeholder="Enter your e-mail"
                            value={email}
                            required
                            onChange={handleInputChange(setEmail)}
                        />
                    </label>
                    <button type="submit">Send</button>
                    {error && <p className={styles.error}>{error}</p>}
                    <span>Remember the password? <Link href="/account/login">Go back</Link></span>
                </form>
            </section>
            <MobileMenu/>
        </div>
    );
};

export default Recover;
