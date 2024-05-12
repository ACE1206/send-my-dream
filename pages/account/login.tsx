import styles from "../../styles/Auth.module.scss"
import React, {useState} from "react";
import Link from "next/link";
import Header from "../../components/Header/Header";
import MobileMenu from "../../components/Menu/MobileMenu";
import axios from "axios";

const Login: React.FC = () => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post("https://localhost:8080/auth/login", {email: email, password: password})
            const token = response.data.token
            localStorage.setItem("AuthorizationToken", token)
            localStorage.getItem("AuthorizationToken")
        } catch (error) {
            console.log(error.status)
        }
    }

    return (
        <div className={styles.login}>
            <Header/>
            <section className={styles.container}>
                <div className={styles.title}>
                    <h1>Welcome to Send my dream!</h1>
                    <p>Log In</p>
                </div>
                <form action="/">
                    <label className={styles.email}>
                        <input type="email" placeholder="Enter your e-mail" onChange={handleInputChange(setEmail)}/>
                    </label>
                    <label className={styles.password}>
                        <input type="password" placeholder="Enter the password"
                               onChange={handleInputChange(setPassword)}/>
                    </label>
                    <button type="submit">Log In</button>
                    <p>By clicking "Continue", you accept the terms of the privacy policy</p>
                    <span>Don't you have an account? <Link href="/account/register">Register</Link></span>
                    <div className={styles.oAuth}>
                        <span>Or connect using your</span>
                        <div>
                            <Link className={styles.google}  href="/">Google</Link>
                            <Link className={styles.facebook}  href="/">Facebook</Link>
                        </div>
                    </div>
                </form>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default Login
