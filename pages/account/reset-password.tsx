import styles from "../../styles/Auth.module.scss";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Header from "../../components/Header/Header";
import MobileMenu from "../../components/Menu/MobileMenu";
import {resetPassword} from "../../utils/api.js";
import {useRouter} from "next/router";
import {useAuth} from "../../components/Auth/AuthContext";
import Head from "next/head";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const {isAuthenticated} = useAuth();
    const {token} = router.query;

    useEffect(() => {
        if (isAuthenticated || token === null) {
            router.replace("/account")
        }
    }, [isAuthenticated]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords don't match")
        } else {
            try {
                await resetPassword(token, password);
                setError("Password changed.");
                router.push('/account/login');
            } catch (error) {
                setError("Passwords don't match")
                console.error('Ошибка при изменении пароля:', error);
            }
        }
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const toggleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword((prevState) => !prevState);
    };

    return (
        <div className={styles.login}>
            <Head>
                <title>Reset password</title>
            </Head>
            <Header/>
            <section className={styles.container}>
                <div className={styles.title}>
                    <h1>Create a new password</h1>
                    <p>Create a new password and write it twice</p>
                </div>
                <form onSubmit={handleSubmit}>
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
                    <label className={styles.password}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm the password"
                            required
                            value={confirmPassword}
                            onChange={handleInputChange(setConfirmPassword)}
                        />
                        <button type="button" onClick={toggleShowConfirmPassword} className={styles.passwordToggle}>
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </button>
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

export default ResetPassword;
