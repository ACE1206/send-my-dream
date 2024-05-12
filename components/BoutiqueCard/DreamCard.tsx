import styles from './DreamCard.module.scss'
import React from "react";
import {DreamData} from "../../utils/types";
import Image from "next/image";

type DreamCardProps = DreamData & {
    openModal: (dreamCard: DreamData) => void;
};

const DreamCard: React.FC<DreamCardProps> = ({date, img, avatar, author, text, description, openModal}) => {
    return (
        <div style={{backgroundImage: `url(${img})`}} className={styles.dreams}
             onClick={() => openModal({date, img, avatar, author, text, description})}>
            <div>
                <Image src={avatar} alt="" width={220} height={320}/>
                <span>{author}</span>
            </div>
        </div>
    )
}

export default DreamCard
