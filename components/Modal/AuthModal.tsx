import React from 'react';
import styles from './Modal.module.scss';
import Link from "next/link";
import {ModalProps} from "../../utils/types";

const AuthModal: React.FC<ModalProps> = ({onClose}) => {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.content}>
                    <h2>Log in or register</h2>
                    <p>To add a wish, register a new account or log in to an existing one</p>
                    <Link href="/account/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
