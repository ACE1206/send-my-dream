// Модальное окно карточки товара

import styles from "./BoutiqueCardModal.module.scss"
import {ModalProps} from "../../utils/types";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {useAuth} from "../Auth/AuthContext";
import {addProductToBasket, checkIfExistsInBasket, deleteProductFromBasket} from "../../utils/api";
import GenerateLink from "../Generation/GenerateLink";
import {useCart} from "../Basket/CartProvider";
import {useAuthModal} from "../Auth/AuthModalContext";

const Modal: React.FC<ModalProps & {
        availableToAdd?: boolean,
        onChange?: (id: number | null, uuid: string) => void
        share?: (imageLink: number) => void,
        availableToShare?: boolean
    }> = ({
              boutiqueProps,
              availableToAdd = true,
              onClose,
              onChange,
              share,
              availableToShare = false
          }) => {
        const [isInBasket, setIsInBasket] = useState(false);
        const [loaded, setLoaded] = useState(false)
        const [loadedId, setLoadedId] = useState(boutiqueProps.id || null)

        const {isAuthenticated} = useAuth();
        const {isAuthModalOpen, openAuthModal, closeAuthModal} = useAuthModal();
        const {addProductToCart, removeProductFromCart} = useCart();

        // Проверка, есть ли в корзине
        useEffect(() => {
            const checkIfExists = async () => {
                if (isAuthenticated) {
                    if (boutiqueProps.id) {
                        const exists = await checkIfExistsInBasket(boutiqueProps.id);
                        setIsInBasket(exists);
                    }
                }
            }

            if (isAuthenticated) {
                checkIfExists().then(() => setLoaded(true))
            } else {
                setLoaded(true)
            }
        }, [boutiqueProps.id]);


        // Добавление в корзину
        const handleBasketAdd = async (e: React.MouseEvent) => {
            e.preventDefault();
            if (!isAuthenticated) {
                openAuthModal();
            } else {
                const data = new FormData();
                if (boutiqueProps.id) {
                    data.append("id", boutiqueProps.id)
                }
                if (boutiqueProps.category) {
                    data.append("category", boutiqueProps.category.id.toString());
                }
                if (boutiqueProps.image) {
                    data.append("imageLink", boutiqueProps.image)
                }
                data.append("name", boutiqueProps.name);
                data.append("description", boutiqueProps.description);
                data.append("price", boutiqueProps.price.toString());
                e.stopPropagation();
                const productId = await addProductToBasket(data);
                if (productId && onChange) {
                    setLoadedId(productId);
                    onChange(productId, boutiqueProps.uuid);
                }
                setIsInBasket(true);
                addProductToCart()
            }
        }


        // Удаление из корзины
        const handleDeletion = async (e: React.MouseEvent) => {
            e.stopPropagation();
            await deleteProductFromBasket(loadedId);
            setIsInBasket(false);
            if (onChange) {
                onChange(null, boutiqueProps.uuid);
            }
            removeProductFromCart(1)
        };

        useEffect(() => {
            if (boutiqueProps) {
                document.body.style.overflow = 'hidden';
            }
            return () => {
                document.body.style.overflow = 'auto';
            };
        }, [boutiqueProps]);

        const handleShare = () => {
            share(boutiqueProps.id)
        }

        if (!boutiqueProps) return null;

        return (
            <div className={styles.overlay} onClick={onClose}>
                {loaded &&
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <Image src={boutiqueProps.image} alt={boutiqueProps.name} width={600} height={1100}/>
                        <div className={styles.card}>
                            <div className={styles.addToBasket}>
                                {!availableToShare ? (
                                    <></>
                                ) : (
                                    <button className={styles.share} onClick={handleShare}>Share</button>
                                )}
                                {availableToAdd &&
                                    <button
                                        onClick={isInBasket ? handleDeletion : handleBasketAdd}>{isInBasket ? '✓' : '+'}</button>
                                }
                            </div>
                        </div>
                        <button onClick={onClose}></button>
                    </div>
                }
            </div>
        );
    }
;

export default Modal;
