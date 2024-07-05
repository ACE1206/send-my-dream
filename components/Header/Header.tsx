import styles from "./Header.module.scss";
import React, {useState} from "react";
import {menu} from "../../data/menu";
import {IconProps} from "../../utils/types";
import Link from "next/link";
import AuthModal from "../Modal/AuthModal";
import {useAuth} from "../Auth/AuthContext";
import {useRouter} from "next/router";
import {useSocket} from "../Socket/SocketProvider";
import ShareModal from "../Modal/ShareModal";
import classNames from 'classnames';

const Header: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const {isAuthenticated} = useAuth();
    const router = useRouter();
    const {isPlaying, setIsPlaying} = useSocket();

    const handleSoundToggle = () => {
        setIsPlaying(!isPlaying);
    };

    const handleAccountClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!isAuthenticated) {
            e.preventDefault();
            setModalOpen(true);
        } else {
            router.push('/account');
        }
    };

    return (
        <>
            <section
                className={classNames(styles.header, {[styles.bordered]: !router.pathname.includes('/administrator') && router.pathname !== '/'})}>
                <Link className={styles.logo} href="/boutique"></Link>
                <Link className={styles.home} href={"/"}></Link>
                <button className={styles.button}>EN</button>
                <button className={isPlaying ? styles.soundOn : styles.soundOff} onClick={handleSoundToggle}></button>
                <div className={styles.icons}>
                    {menu.map((item: IconProps, index: React.Key) => (
                        <Link onClick={item.alt === "Share" ? (e) => {
                            e.preventDefault()
                            setShareModal(true)
                        } : () => {
                        }} style={{backgroundImage: `url("${item.img}")`}} href={item.link} key={index}
                              className={item.alt === 'Share' || item.alt === 'React' ? 'hide-on-mobile' : ''}></Link>
                    ))}
                    <Link className="hide-on-mobile" href="/account" onClick={handleAccountClick}
                          style={{
                              backgroundImage: `url("/images/user.svg")`,
                              display: router.pathname.includes('/login') || router.pathname.includes("/register") ? "none" : "inline-block"
                          }}></Link>
                </div>
            </section>
            {modalOpen && <AuthModal onClose={() => setModalOpen(false)}/>}
            {shareModal && <ShareModal empty={true} onClose={() => setShareModal(false)}/>}
        </>
    );
};

export default Header;
