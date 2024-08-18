// МОдальное ошибки

import styles from './Modal.module.scss'
import Link from "next/link";
import React from "react";

const ErrorModal = ({onClose, title, text, buttonText}) => {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.content}>
                    <h2>{title}</h2>
                    <p>{text}</p>
                    <button onClick={onClose}>{buttonText}</button>
                </div>
            </div>
        </div>
    )
}

export default ErrorModal
