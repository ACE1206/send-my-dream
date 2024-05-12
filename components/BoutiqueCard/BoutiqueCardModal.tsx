import styles from "./BoutiqueCardModal.module.scss"
import {ModalProps} from "../../utils/types";
import React, {useEffect} from "react";

const Modal: React.FC<ModalProps> = ({boutiqueProps, onClose}) => {
    useEffect(() => {
        if (boutiqueProps) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [boutiqueProps]);

    if (!boutiqueProps) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <img src={boutiqueProps.img} alt={boutiqueProps.alt}/>
                <div className={styles.card}>
                    <h2>{boutiqueProps.text}</h2>
                    <p>{boutiqueProps.description}</p>
                    <div className={styles.addToBasket}>
                        <span>{boutiqueProps.cost}</span>
                        <button onClick={e => e.stopPropagation()}>+</button>
                    </div>
                </div>
                <button onClick={onClose}></button>
            </div>
        </div>
    );
};

export default Modal;
