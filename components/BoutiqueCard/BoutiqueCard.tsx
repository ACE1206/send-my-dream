import styles from "./BoutiqueCard.module.scss"
import React, {useState, useEffect} from "react";
import Image from "next/image";
import {CardData, CardProps} from "../../utils/types";
import {useAuth} from "../Auth/AuthContext";
import AuthModal from "../Modal/AuthModal";
import {addProductToBasket, checkIfExistsInBasket} from "../../utils/api";

const BoutiqueCard: React.FC<CardProps> = ({id, image, category, video, name, description, price, openModal}) => {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [isInBasket, setIsInBasket] = useState(false);

    const {isAuthenticated} = useAuth();

    useEffect(() => {
        const checkIfExists = async () => {
            const exists = await checkIfExistsInBasket(id);
            setIsInBasket(exists);
        };

        checkIfExists();
    }, [id]);

    const handleBasketAdd = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            setAuthModalOpen(true);
        } else {
            await addProductToBasket({id, category, image, name, description, price});
            setIsInBasket(true);  // Обновляем состояние после добавления
        }
    }

    return (
        <>
            <div className={styles.boutiqueCard} onClick={() => {
                const modalData: CardData = {image, name, description, price};
                category ? modalData.category = category : modalData.video = video;
                openModal(modalData);
            }}>
                <Image src={image} alt={name} width={320} height={375}/>
                <span>{name}</span>
                <div className={styles.addToBasket}>
                    <span>{price}</span>
                    <button onClick={handleBasketAdd}>{isInBasket ? '✔' : '+'}</button>
                </div>
            </div>
            {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)}/>}
        </>
    )
};

export default BoutiqueCard;
