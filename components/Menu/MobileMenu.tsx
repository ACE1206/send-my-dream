// Мобильное меню

import styles from './MobileMenu.module.scss'
import React, {useState} from "react";
import Link from "next/link";
import {mobileMenu} from "../../data/mobile_menu";
import AuthModal from "../Modal/AuthModal";
import {useAuth} from "../Auth/AuthContext";
import {useRouter} from "next/router";
import {useAuthModal} from "../Auth/AuthModalContext";
import {useCart} from "../Basket/CartProvider";

const MobileMenu: React.FC = () => {
    const {isAuthenticated} = useAuth();
    const router = useRouter();
    const {isAuthModalOpen, openAuthModal, closeAuthModal} = useAuthModal();
    const { countProducts } = useCart();

    // Обработка нажатия на аккаунт
    const handleAccountClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            e.preventDefault();
        if (!isAuthenticated) {
            router.push('/account/register')
        } else {
            router.push('/account');
        }
    };

    return (
        <div className={styles.mobileMenu}>
                    <Link style={{backgroundImage: `url("/images/home.svg")`}} href={"/boutique"}/>
            <div className={styles.auth}>
                <Link onClick={e => handleAccountClick(e) } style={{backgroundImage: `url("/images/user.svg")`}} href={"/account"}/>
                {countProducts != null && countProducts > 0 && (
                    <span className={styles.counter}>{countProducts}</span>
                )}
            </div>
                    <Link style={{backgroundImage: `url("/images/react.svg")`}} href={"/motivation"}/>
        </div>
    )
}

export default MobileMenu
