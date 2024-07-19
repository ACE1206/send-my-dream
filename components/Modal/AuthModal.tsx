import React from 'react';
import styles from './Modal.module.scss';
import Link from "next/link";
import {ModalProps} from "../../utils/types";
import {useAuthModal} from "../Auth/AuthModalContext";
import {useRouter} from "next/router";

const AuthModal: React.FC<ModalProps> = ({onClose}) => {

    const {closeAuthModal} = useAuthModal()
    const router = useRouter()

    if (router.pathname === "/account/login") {
        return null;
    }

    return (
        <div className={styles.overlay} onClick={closeAuthModal}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.content}>
                    <h2>Log in or register</h2>
                    <p>To add a wish, register a new account or log in to an existing one</p>
                    <Link onClick={closeAuthModal} href="/account/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
