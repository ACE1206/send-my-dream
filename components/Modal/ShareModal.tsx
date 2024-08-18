// Модальное поделиться

import styles from './Modal.module.scss'
import React, {useEffect} from "react";
import {ModalProps} from "../../utils/types";
import classNames from 'classnames';
import Image from "next/image";

const ShareModal: React.FC<ModalProps & { empty?: boolean }> = ({onClose, empty = false}) => {

    useEffect(() => {

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const copyTextToClipboard = async (link) => {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(link);
        } else {
            return document.execCommand('copy', true, link);
        }
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={classNames(styles.share)}>
                    <div>
                        <h2>Share with your friends!</h2>
                        <button onClick={() => copyTextToClipboard(`${GLOBAL_URL}`)}
                                className={styles.copy}>{GLOBAL_URL}</button>
                    </div>
                        <Image src={"/images/qr-code.webp"} alt={"Send My Dreams"} width={1000} height={1000} />
                </div>
                <button onClick={onClose}></button>
            </div>
        </div>
    )
}

export default ShareModal
