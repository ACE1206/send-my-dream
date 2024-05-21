import React from 'react';
import styles from './Modal.module.scss';
import Link from "next/link";
import {ModalProps} from "../../utils/types";

const InsufficientModal: React.FC<ModalProps> = ({onClose}) => {

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.content}>
                    <h2>Insufficient funds</h2>
                    <p>To make a payment you need 30 coins</p>
                    <p>You only have 20 coins</p>
                    <Link href="/account/choose">Top up balance</Link>
                </div>
            </div>
        </div>
    );
};

export default InsufficientModal;
