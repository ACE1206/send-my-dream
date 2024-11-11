import styles from "./Header.module.scss";
import React, {useEffect, useState} from "react";
import {menu} from "../../data/menu";
import {IconProps} from "../../utils/types";
import Link from "next/link";
import {useAuth} from "../Auth/AuthContext";
import {useRouter} from "next/router";
import {useSocket} from "../Socket/SocketProvider";
import ShareModal from "../Modal/ShareModal";
import {countBasketProducts} from "../../utils/api";
import {useCart} from "../Basket/CartProvider";

const Header = () => {
    const [shareModal, setShareModal] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const {isAuthenticated} = useAuth();
    const router = useRouter();
    const {isPlaying, setIsPlaying} = useSocket();
    const {countProducts} = useCart();
    const {isAuthModalOpen, openAuthModal, closeAuthModal} = useAuth();

    // Проверка разрешения
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");

        const handleMediaQueryChange = (event) => {
            setIsMobile(event.matches);
        };

        setIsMobile(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, []);


    // Воспроизведение звука
    const handleSoundToggle = () => {
        setIsPlaying(!isPlaying);
    };


    // Обработка нажатия на аккаунт
    const handleAccountClick = (e) => {
        if (!isAuthenticated) {
            router.push('/account/register')
        } else {
            router.push('/account');
        }
    };

    return (
        <>
            <section className={styles.header}>
                <div className={styles.buttons}>
                    <Link className={`${styles.home} hide-on-mobile`} href={"/boutique"}></Link>
                    <button className={styles.button}>EN</button>
                    <button className={isPlaying ? styles.soundOn : styles.soundOff}
                            onClick={handleSoundToggle}></button>
                </div>
                <div className={styles.logo}>
                <Link href="/"></Link>
                </div>
                <div className={styles.icons}>
                    {menu.map((item: IconProps, index: React.Key) => (
                        <Link onClick={item.alt === "Share" ? (e) => {
                            e.preventDefault();
                            setShareModal(true);
                        } : () => {
                        }}
                              style={{backgroundImage: `url("${item.img}")`}}
                              href={item.link}
                              key={index}
                              className={item.alt === 'React' ? 'hide-on-mobile' : ''}>
                        </Link>
                    ))}
                    <div style={{
                        backgroundImage: `url("/images/user.svg")`,
                        display: router.pathname.includes('/login') || router.pathname.includes("/register") ? "none" : "inline-block"
                    }} className={`${styles.auth} hide-on-mobile`}>
                        <Link href="/account/register" onClick={handleAccountClick}></Link>
                        {countProducts != null && countProducts > 0 && (
                            <span className={styles.counter}>{countProducts}</span>
                        )}
                    </div>
                </div>
            </section>
            {shareModal && <ShareModal empty={true} onClose={() => setShareModal(false)}/>}
        </>
    );
};

export default Header;
