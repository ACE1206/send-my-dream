import React, { useState } from 'react';
import Link from 'next/link';
import styles from "../../styles/Auth.module.scss";
import Header from "../../components/Header/Header";
import MobileMenu from "../../components/Menu/MobileMenu";
import {registerUser} from "../../utils/api";
import {useRouter} from "next/router";
import {useAuth} from "../../components/Auth/AuthContext";
import Head from "next/head";

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter()
    const { referral } = router.query;
    const [promoCode, setPromoCode] = useState("")

    const {login} = useAuth();

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const userData = { email, password, username: firstName, promoCode};
            const { token } = await registerUser(userData, referral);
            login(token)
        } catch (err) {
            setError('Failed to register user');
            console.error(err);
        }
    };

    return (
        <div className={styles.login}>
            <Head>
                <title>Register</title>
            </Head>
            <div className={styles.overlay}></div>
            <Header />
            <section className={styles.container}>
                <div className={styles.title}>
                    <h1>Welcome to Send my dream!</h1>
                    <p>Register</p>
                </div>
                <form onSubmit={handleRegister}>
                    <label className={styles.name}>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </label>
                    <label className={styles.email}>
                        <input
                            type="email"
                            placeholder="Enter your e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label className={styles.password}>
                        <input
                            type="password"
                            placeholder="Enter the password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <p>Use shared promo code get reward 2 coins</p>
                    <label className={styles.promoCode}>
                        <input className={styles.promoCode} type="text" placeholder="Promo code" value={promoCode} onChange={handleInputChange(setPromoCode)} />
                    </label>
                    <button type="submit">Register</button>
                    {error && <p className={styles.error}>{error}</p>}
                    <p>By clicking "Continue", you accept the terms of the privacy policy</p>
                    <span>Already have an account? <Link href="/account/login">Login</Link></span>
                    <div className={styles.oAuth}>
                        <span>Or connect using your</span>
                        <div>
                            <Link className={styles.google} href="https://space-link.online/api/oauth2/authorization/google">Google</Link>
                            <Link className={styles.facebook} href="https://space-link.online/api/oauth2/authorization/google">Facebook</Link>
                        </div>
                    </div>
                </form>
            </section>
            <MobileMenu />
        </div>
    );
};

export default Register;
