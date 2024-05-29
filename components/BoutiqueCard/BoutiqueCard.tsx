import styles from "./BoutiqueCard.module.scss"
import React from "react";
import Image from "next/image";
import {CardData, CardProps} from "../../utils/types";

const BoutiqueCard: React.FC<CardProps> = ({dream_image, category, video, title, description, cost, openModal}) => {
    return (
        <div className={styles.boutiqueCard} onClick={() => {
            const modalData: CardData = {dream_image, title, description, cost};
            category ? modalData.category = category : modalData.video = video
            openModal(modalData)
        }}>
            <Image src={dream_image} alt={title} width={320} height={375}/>
            <span>{title}</span>
            <div className={styles.addToBasket}>
                <span>{cost}</span>
                <button onClick={e => e.stopPropagation()}>+</button>
            </div>
        </div>
    )
};

export default BoutiqueCard;
