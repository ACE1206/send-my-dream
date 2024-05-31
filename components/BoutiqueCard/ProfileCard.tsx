import styles from "./ProfileCard.module.scss"
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {CardProps} from "../../utils/types";

const ProfileCard: React.FC<CardProps & { onSelect?: (selected: boolean) => void, isSelected?: boolean }> = ({image, category, name, description, price, openModal, onSelect, isSelected}) => {
    const [selected, setSelected] = useState(false);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(e.target.checked);
        onSelect(e.target.checked);
    };

    useEffect(() => {
        setSelected(isSelected);
    }, [isSelected]);

    return (
        <div className={styles.profileCard} onClick={() => openModal({image, category, name, description, price})}>
            <Image src={image} alt={name} width={320} height={375}/>
            <label onClick={e => e.stopPropagation()}>{category}
                <input type="checkbox" checked={selected} onChange={handleSelect}/>
                <span className={styles.checkboxCustom}></span>
            </label>
            <span>{name}</span>
            <div className={styles.addToBasket}>
                <span>{price}</span>
            </div>
        </div>
    )
}

export default ProfileCard
