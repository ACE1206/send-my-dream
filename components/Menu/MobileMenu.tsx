import styles from './MobileMenu.module.scss'
import React, {useState} from "react";
import Link from "next/link";
import {mobileMenu} from "../../data/mobile_menu";
import AuthModal from "../Modal/AuthModal";
import {useAuth} from "../Auth/AuthContext";
import {useRouter} from "next/router";

const MobileMenu: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const {isAuthenticated} = useAuth();
    const router = useRouter();

    const handleAccountClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            e.preventDefault();
        if (!isAuthenticated) {
            setModalOpen(true);
        } else {
            router.push('/account/');
        }
    };

    return (
        <div className={styles.mobileMenu}>
            {mobileMenu.map((item, index: React.Key) => (
                <div key={index}>
                    <Link onClick={item.alt === 'Account' ? e => handleAccountClick(e) : e => {}} style={{backgroundImage: `url("${item.img}")`}} href={item.link}/>
                </div>
            ))}
            {modalOpen && <AuthModal onClose={() => setModalOpen(false)}/>}
        </div>
    )
}

export default MobileMenu
