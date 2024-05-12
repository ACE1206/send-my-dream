import styles from "./Header.module.scss"
import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import {menu} from "../../data/menu";
import {IconProps} from "../../utils/types";
import Link from "next/link";
import AuthModal from "../Modal/AuthModal";

const Header: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const [playing, setPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            playing ? audioRef.current.play() : audioRef.current.pause();
        }
    }, [playing]);

    const togglePlay = () => {
        setPlaying(!playing);
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
                <button className='hide-on-mobile'>
                    <Image src="/user.svg" alt="User" width={30} height={30} onClick={() => setModalOpen(true)}/>
                </button>
                {modalOpen && <AuthModal onClose={() => setModalOpen(false)}/>}
            </div>
        </section>
    )
}

export default Header;
