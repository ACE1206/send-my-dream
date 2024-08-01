import styles from "../../styles/Auth.module.scss";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Header from "../../components/Header/Header";
import MobileMenu from "../../components/Menu/MobileMenu";
import {loginUser} from "../../utils/api.js";
import {useRouter} from "next/router";
import {useAuth} from "../../components/Auth/AuthContext";
import Head from "next/head";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const {login, isAuthenticated} = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/account");
        }
    }, [isAuthenticated]);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        const userData = { email, password };
        const response = await loginUser(userData);

        if (response.error) {
            setError(response.error);
        } else {
            const { token } = response;
            login(token);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <div className={styles.login}>
            <Head>
                <title>Login</title>
            </Head>
            <Header/>
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
                            required
                            value={email}
                            onChange={handleInputChange(setEmail)}
                        />
                    </label>
                    <label className={styles.password}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter the password"
                            required
                            value={password}
                            onChange={handleInputChange(setPassword)}
                        />
                        <button type="button" onClick={toggleShowPassword} className={styles.passwordToggle}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    </label>
                    <button type="submit">Log In</button>
                    {error && <p className={styles.error}>{error}</p>}
                    <p>By clicking "Continue", you accept the terms of the privacy policy</p>
                    <span>Don't you have an account? <Link href="/account/register">Register</Link></span>
                    <span>Forget password? <Link href="/account/recover">Recover</Link></span>
                    <div className={styles.oAuth}>
                        <span>Or connect using your</span>
                        <div>
                            <Link className={styles.google} href={`${API_URL}/oauth2/authorization/google`}>Google</Link>
                        </div>
                    </div>
                </form>
            </section>
            <MobileMenu/>
        </div>
    );
};

export default Login;
