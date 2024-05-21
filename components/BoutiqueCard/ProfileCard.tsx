import styles from "./ProfileCard.module.scss"
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {CardProps} from "../../utils/types";

const ProfileCard: React.FC<CardProps & { onSelect?: (selected: boolean) => void, isSelected?: boolean }> = ({img, category, text, alt, description, cost, openModal, onSelect, isSelected}) => {
    const [selected, setSelected] = useState(false);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelected(e.target.checked);
        onSelect(e.target.checked);
    };

    useEffect(() => {
        setSelected(isSelected);
    }, [isSelected]);

    return (
        <div className={styles.profileCard} onClick={() => openModal({img, category, text, description, alt, cost})}>
            <Image src={img} alt={alt} width={320} height={375}/>
            <label onClick={e => e.stopPropagation()}>{category}
                <input type="checkbox" checked={selected} onChange={handleSelect}/>
                <span className={styles.checkboxCustom}></span>
            </label>
            <span>{text}</span>
            <div className={styles.addToBasket}>
                <span>{cost}</span>
            </div>
        </div>
    )
}

export default ProfileCard
