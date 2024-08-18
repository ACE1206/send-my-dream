// Модальное карточки в мотивации (мечты)

import styles from "./BoutiqueCardModal.module.scss"
import React, {useEffect} from "react";
import {DreamData} from "../../utils/types";
import Image from "next/image";

type ModalProps = {
    cardProps: DreamData;
    onClose: () => void;
}
const Modal: React.FC<ModalProps> = ({cardProps, onClose}) => {
    useEffect(() => {
        if (cardProps) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [cardProps]);

    if (!cardProps) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <Image src={cardProps.img} alt={cardProps.text} width={1100} height={1100}/>
                <div className={styles.dream}>
                    <div className={styles.author}>
                        <Image src={cardProps.avatar} alt="" width={100} height={100}/>
                        <span>{cardProps.author}</span>
                    </div>
                    <div className={styles.content}>
                        <span>{cardProps.date}</span>
                        <h3>{cardProps.text}</h3>
                        <p>{cardProps.description}</p>
                    </div>
                </div>
                <button className={`hide-on-mobile`} onClick={onClose}></button>
            </div>
        </div>
    );
};

export default Modal;
