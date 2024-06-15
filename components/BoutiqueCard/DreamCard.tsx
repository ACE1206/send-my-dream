import styles from './DreamCard.module.scss';
import React from "react";
import { DreamData } from "../../utils/types";
import Image from "next/image";

type DreamCardProps = DreamData & {
    openModal: (dreamCard: DreamData) => void;
};

const DreamCard: React.FC<DreamCardProps> = ({ date, img, avatar, author, text, description, openModal }) => {
    return (
        <div className={styles.dreams} onClick={() => openModal({ date, img, avatar, author, text, description })}>
            <Image src={img} alt={text} width={500} height={500}/>
            <div className={styles.dreamCardContent}>
                <Image src={avatar} alt={author} width={220} height={320} />
                <span>{author}</span>
            </div>
        </div>
    );
};

export default DreamCard;
