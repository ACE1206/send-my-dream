import styles from './Modal.module.scss'
import React from "react";
import Link from "next/link";
import {ModalProps} from "../../utils/types";

const ShareModal:React.FC<ModalProps> = ({onClose}) => {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.clearModal} onClick={e => e.stopPropagation()}>
                <div className={styles.clearContent}>
                    <h2>Share your Dreams!</h2>
                    <p>Share your desires with your loved ones - bring them closer to realization</p>
                    <Link href="/account/choose">Share your wishes</Link>
                </div>
            </div>
        </div>
    )
}

export default ShareModal
