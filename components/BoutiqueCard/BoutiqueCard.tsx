import styles from "./BoutiqueCard.module.scss"
import React from "react";
import Image from "next/image";
import {CardData, CardProps} from "../../utils/types";

const BoutiqueCard: React.FC<CardProps> = ({image, category, video, name, description, price, openModal}) => {
    return (
        <div className={styles.boutiqueCard} onClick={() => {
            const modalData: CardData = {image, name, description, price};
            category ? modalData.category = category : modalData.video = video
            openModal(modalData)
        }}>
            <Image src={image} alt={name} width={320} height={375}/>
            <span>{name}</span>
            <div className={styles.addToBasket}>
                <span>{price}</span>
                <button onClick={e => e.stopPropagation()}>+</button>
            </div>
        </div>
    )
};

export default BoutiqueCard;
