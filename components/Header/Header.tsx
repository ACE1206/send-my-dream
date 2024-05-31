import styles from "./Header.module.scss"
import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import {menu} from "../../data/menu";
import {IconProps} from "../../utils/types";
import Link from "next/link";
import AuthModal from "../Modal/AuthModal";
import {isUser, useAuth} from "../Auth/AuthContext";
import {useRouter} from "next/router";

const Header: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const router = useRouter()

    useEffect(() => {
        if (audioRef.current) {
            playing ? audioRef.current.play() : audioRef.current.pause();
        }
    }, [playing]);

    const togglePlay = () => {
        setPlaying(!playing);
    };

    const handleAccountClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!isUser()) {
            e.preventDefault();
            setModalOpen(true);
        } else {
            router.push('/account')
        }
    };

    return (
        <section className={styles.header}>
            <audio loop ref={audioRef} preload="auto">
                <source src="/sound/background-music.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <Link className={styles.logo} href="/"></Link>
            <button className={styles.button}>EN</button>
            <button onClick={togglePlay} className={playing ? styles.soundOn : styles.soundOff}>
            </button>
            <div className={styles.icons}>
                {menu.map((item: IconProps, index: React.Key) => (
                    <Link style={{backgroundImage: `url("${item.img}")`}} href={item.link} key={index} className={item.alt === 'Share' || item.alt === 'React' ? 'hide-on-mobile' : ''}>
                    </Link>
                ))}
                    <Link className="hide-on-mobile" href="/account" onClick={handleAccountClick} style={{backgroundImage: `url("/images/user.svg")`}}></Link>
                {modalOpen && <AuthModal onClose={() => setModalOpen(false)}/>}
            </div>
        </section>
    )
}

export default Header;
