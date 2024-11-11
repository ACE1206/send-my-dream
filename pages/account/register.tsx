import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import styles from "../../styles/Auth.module.scss";
import Header from "../../components/Header/Header";
import MobileMenu from "../../components/Menu/MobileMenu";
import {registerUser} from "../../utils/api";
import {useRouter} from "next/router";
import {useAuth} from "../../components/Auth/AuthContext";
import Head from "next/head";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter()
    const {referral} = router.query;
    const [promoCode, setPromoCode] = useState("")

    const {login, isAuthenticated} = useAuth();

    useEffect(() => {
        console.log(isAuthenticated)
        if (isAuthenticated) {
            router.replace("/account")
        }
    }, [isAuthenticated]);

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null)
        const userData = {email, password, username: email.split('@')[0], promoCode};
        const response = await registerUser(userData, referral);

        if (response.error) {
            setError(response.error)
        } else {
            const {token} = response
            login(token)
        }
    };

    const toggleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <div className={styles.login}>
            <Head>
                <title>Register</title>
            </Head>
            <div className={styles.overlay}></div>
            <Header/>
            <section className={styles.container}>
                <div className={styles.title}>
                    <h1>Welcome to Send my dream!</h1>
                    <p>Register</p>
                </div>
                <form onSubmit={handleRegister}>
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
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter the password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="button" onClick={toggleShowPassword} className={styles.passwordToggle}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                        </button>
                    </label>
                    <p>Use shared promo code get reward coins</p>
                    <label className={styles.promoCode}>
                        <input className={styles.promoCode} type="text" placeholder="Promo code" value={promoCode}
                               onChange={handleInputChange(setPromoCode)}/>
                    </label>
                    <button type="submit">Register</button>
                    {error && <p className={styles.error}>{error}</p>}
                    <p>By clicking "Continue", you accept the terms of the privacy policy</p>
                    <span>Already have an account? <Link href="/account/login">Login</Link></span>
                    <div className={styles.oAuth}>
                        <span>Or connect using your</span>
                        <div>
                            <Link className={styles.google}
                                  href={`${API_URL}/oauth2/authorization/google`}>Google</Link>
                        </div>
                    </div>
                </form>
            </section>
            <MobileMenu/>
        </div>
    );
};

export default Register;
