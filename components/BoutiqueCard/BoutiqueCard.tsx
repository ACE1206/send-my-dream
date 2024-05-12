import styles from "./BoutiqueCard.module.scss"
import React from "react";
import Image from "next/image";
import {CardData, CardProps} from "../../utils/types";

const BoutiqueCard: React.FC<CardProps> = ({img, category, video, text, alt, description, cost, openModal}) => {
    return (
        <div className={styles.boutiqueCard} onClick={() => {
            const modalData: CardData = {img, text, description, alt, cost};
            category ? modalData.category = category : modalData.video = video
            openModal(modalData)
        }}>
            <Image src={img} alt={alt} width={320} height={375}/>
            <span>{text}</span>
            <div className={styles.addToBasket}>
                <span>{cost}</span>
                <button onClick={e => e.stopPropagation()}>+</button>
            </div>
        </div>
    )
};

export default BoutiqueCard;
