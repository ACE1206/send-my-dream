import styles from './MobileMenu.module.scss'
import React, {useState} from "react";
import Link from "next/link";
import {mobileMenu} from "../../data/mobile_menu";
import AuthModal from "../Modal/AuthModal";

const MobileMenu: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className={styles.mobileMenu}>
            {mobileMenu.map((item, index: React.Key) => (
                <div key={index}>
                    <Link  onClick={item.alt === 'Account' ? e => {
                        e.preventDefault()
                        setModalOpen(true)
                        return false
                    } : e => {
                    }} style={{backgroundImage: `url("${item.img}")`}} href={item.link}/>
                </div>
            ))}
            {modalOpen && <AuthModal onClose={() => setModalOpen(false)}/>}
        </div>
    )
}

export default MobileMenu
