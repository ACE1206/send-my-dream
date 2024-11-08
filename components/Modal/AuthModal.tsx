// МОдальное авторизации

import React, {useEffect, useState} from 'react';
import styles from './Modal.module.scss';
import Link from "next/link";
import {ModalProps} from "../../utils/types";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {registerUser} from "../../utils/api";
import {useAuth} from "../Auth/AuthContext";

const AuthModal: React.FC<ModalProps> = ({onClose}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter()
    const {referral} = router.query;
    const [promoCode, setPromoCode] = useState("")
    const {closeAuthModal} = useAuth()

    const {login, isAuthenticated} = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/account")
        }
    }, [isAuthenticated]);

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };


    if (router.pathname === "/account/login") {
        return null;
    }

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
        <div className={styles.overlay} onClick={closeAuthModal}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.authContent}>
                    <h2>Register</h2>
                    <p>To send a wish, register a new account or log in to an existing one</p>
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
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash}/>
                            </button>
                        </label>
                        <p>Use shared promo code get reward 2 coins</p>
                        <label className={styles.promoCode}>
                            <input className={styles.promoCode} type="text" placeholder="Promo code" value={promoCode}
                                   onChange={handleInputChange(setPromoCode)}/>
                        </label>
                        <button type="submit">Register</button>
                        <p>By clicking "Continue", you accept the terms of the privacy policy</p>
                        <span>Already have an account? <Link href="/account/login">Login</Link></span>
                        {error && <p className={styles.error}>{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
