import styles from "./BoutiqueCard.module.scss";
import React, {useState, useEffect} from "react";
import Image from "next/image";
import {CardData} from "../../utils/types";
import {useAuth} from "../Auth/AuthContext";
import {addProductToBasket, checkIfExistsInBasket, deleteProductFromBasket} from "../../utils/api";
import {useCart} from "../Basket/CartProvider";
import {useAuthModal} from "../Auth/AuthModalContext";

const BoutiqueCard: React.FC<{
    card: CardData,
    openModal: () => void,
    availableToAdd?: boolean,
    onChange?: (id: number | null, uuid: string) => void
    registerCheckIfExists?: (checkFunction: () => void) => void
}> = ({card, openModal, availableToAdd = true, onChange, registerCheckIfExists}) => {
    const {openAuthModal} = useAuthModal();
    const [isInBasket, setIsInBasket] = useState(false);
    const {isAuthenticated} = useAuth();
    const {addProductToCart, removeProductFromCart} = useCart();

    useEffect(() => {
        const checkIfExists = async () => {
            if (isAuthenticated && card.id) {
                const exists = await checkIfExistsInBasket(card.id);
                setIsInBasket(exists);
            }
        };

        if (registerCheckIfExists) {
            registerCheckIfExists(checkIfExists);
        }
        checkIfExists();
    }, [card, isAuthenticated]);

    const handleBasketAdd = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            openAuthModal();
        } else {
            const data = new FormData();
            if (card.id) {
                data.append("id", card.id)
            }
            if (card.category) {
                data.append("category", card.category.id.toString())
            }
            if (card.image) {
                data.append("imageLink", card.image)
            }
            data.append("name", card.name)
            data.append("description", card.description)
            data.append("price", card.price.toString())
            const productId = await addProductToBasket(data)
            onChange(productId, card.uuid);
            setIsInBasket(true);
            addProductToCart();
        }
    };

    const handleDeletion = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await deleteProductFromBasket(card.id);
        onChange(null, card.uuid);
        setIsInBasket(false);
        removeProductFromCart(1);
    };

    return (
        <div className={styles.boutiqueCard} onClick={openModal}>
            <Image src={card.image} alt={card.name} width={320} height={375}/>
            <span>{card.name}</span>
            <div className={styles.addToBasket}>
                <span>{card.price}</span>
                {availableToAdd && (
                    <button onClick={isInBasket ? handleDeletion : handleBasketAdd}>
                        {isInBasket ? '✓' : '+'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default BoutiqueCard;
