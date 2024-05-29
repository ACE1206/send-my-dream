import React, {useState} from 'react';
import styles from './Modal.module.scss';
import Image from "next/image";
import {CardData, ModalProps} from "../../utils/types";

const MeditationModal: React.FC<CardData & ModalProps> = ({video, onClose}) => {
    const [confirmed, setConfirmed] = useState(false);

    const handleConfirm = () => {
        setConfirmed(true);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {!confirmed ? (
                    <div className={styles.content}>
                        <h2>Confirm your purchase</h2>
                        <p>The cost of audio meditation is <b>5 coins</b>, confirm your purchase</p>
                        <button onClick={handleConfirm}>Confirm</button>
                    </div>
                ) : (
                    <div className={styles.video}>
                        <Image src={video} alt="" width={1190} height={600}/>
                        <div>
                            <div>
                                <h3>Meditation</h3>
                                <span>Duration: 12 min, 32 sec</span>
                            </div>
                            <button></button>
                        </div>
                        <button onClick={onClose} className={`hide-on-desktop`}></button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeditationModal;
