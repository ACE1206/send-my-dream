import styles from "../../styles/Auth.module.scss";
import React, { useState } from "react";
import Link from "next/link";
import Header from "../../components/Header/Header";
import MobileMenu from "../../components/Menu/MobileMenu";
import { loginUser } from "../../utils/api";
import {useRouter} from "next/router";

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleInputChange = (setter: { (value: React.SetStateAction<string>): void; (value: React.SetStateAction<string>): void; (arg0: any): void; }) => (e) => {
        setter(e.target.value);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData = { email, password };
            const { access, refresh } = await loginUser(userData);
            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);
            console.log('User authenticated:', { access, refresh });
            await router.push('/boutique');
        } catch (error) {
            setError(error.message);
            console.error(error);
        }
    };

    return (
        <div className={styles.login}>
            <Header />
            <section className={styles.container}>
                <div className={styles.title}>
                    <h1>Welcome to Send my dream!</h1>
                    <p>Log In</p>
                </div>
                <form onSubmit={handleLogin}>
                    <label className={styles.email}>
                        <input
                            type="email"
                            placeholder="Enter your e-mail"
                            value={email}
                            onChange={handleInputChange(setEmail)}
                        />
                    </label>
                    <label className={styles.password}>
                        <input
                            type="password"
                            placeholder="Enter the password"
                            value={password}
                            onChange={handleInputChange(setPassword)}
                        />
                    </label>
                    <button type="submit">Log In</button>
                    {error && <p className={styles.error}>{error}</p>}
                    <p>By clicking "Continue", you accept the terms of the privacy policy</p>
                    <span>Don't you have an account? <Link href="/account/register">Register</Link></span>
                    <div className={styles.oAuth}>
                        <span>Or connect using your</span>
                        <div>
                            <Link className={styles.google} href="/">Google</Link>
                            <Link className={styles.facebook} href="/">Facebook</Link>
                        </div>
                    </div>
                </form>
            </section>
            <MobileMenu />
        </div>
    );
};

export default Login;
