import styles from "../../styles/Auth.module.scss"
import React from "react";
import Link from "next/link";
import Header from "../../components/Header/Header";
import MobileMenu from "../../components/Menu/MobileMenu";

const Login: React.FC = () => {
    return (
        <div className={styles.login}>
            <Header/>
            <section className={styles.container}>
                <div className={styles.title}>
                    <h1>Welcome to Send my dream!</h1>
                    <p>Register</p>
                </div>
                <form action="/">
                    <label className={styles.name}>
                        <input type="text" placeholder="Enter your name"/>
                    </label>
                    <label className={styles.email}>
                        <input type="email" placeholder="Enter your e-mail"/>
                    </label>
                    <label className={styles.password}>
                        <input type="password" placeholder="Enter the password"/>
                    </label>
                    <label className={styles.promoCode}>
                        <input className={styles.promoCode} type="text" placeholder="Promo code"/>
                    </label>
                    <button type="submit">Register</button>
                    <p>By clicking "Continue", you accept the terms of the privacy policy</p>
                    <span>Already have an account? <Link href="/account/login">Login</Link></span>
                    <div className={styles.oAuth}>
                        <span>Or connect using your</span>
                        <div>
                            <Link className={styles.google} href="/">Google</Link>
                            <Link className={styles.facebook} href="/">Facebook</Link>
                        </div>
                    </div>
                </form>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default Login
