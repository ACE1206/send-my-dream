// Карточка товара

import styles from "./BoutiqueCard.module.scss";
import React, {useState, useEffect} from "react";
import Image from "next/image";
import {CardData} from "../../utils/types";
import {useAuth} from "../Auth/AuthContext";
import {
    addProductToBasket,
    checkIfExistsInBasket,
    deleteProductFromBasket,
    getBackgrounds,
    sendProducts
} from "../../utils/api";
import {useCart} from "../Basket/CartProvider";
import {useSocket} from "../Socket/SocketProvider";
import SuccessAnimation from "../Background/SuccessAnimation";
import {useRouter} from "next/router";

const BoutiqueCard: React.FC<{
    card: CardData,
    openModal: () => void,
    availableToAdd?: boolean,
    onChange?: (id: number | null, uuid: string) => void
    registerCheckIfExists?: (checkFunction: () => void) => void
}> = ({card, openModal, availableToAdd = true, onChange, registerCheckIfExists}) => {
    const {openAuthModal} = useAuth();
    const [isInBasket, setIsInBasket] = useState(false);
    const {isAuthenticated} = useAuth();
    const {addProductToCart, removeProductFromCart} = useCart();
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const {isPlaying, setIsPlaying} = useSocket();
    const [showAnimation, setShowAnimation] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const router = useRouter()

    // Проверка разрешения экрана
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");

        const handleMediaQueryChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        setIsMobile(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, []);


    // Отправка
    const confirmSend = async () => {
        const data = await getBackgrounds();
        const selectedBackground = data.find(item => item.id === 5);
        if (selectedBackground) {
            setBackgroundImage(selectedBackground);
        } else {
            console.error('Background with id=5 not found');
        }
        if (isPlaying) {
            setIsPlaying(false)
        }
        setShowAnimation(true);
        setTimeout(async () => {
            const productsToSend = [card.id];
            await sendProducts(productsToSend);
        }, 0);
    };


    // Проверка длительности видео
    const handleVideoDuration = (duration: number) => {
        setTimeout(() => {
            router.push({
                pathname: '/account/success',
                query: {
                    product: card.id,
                    background: backgroundImage.imageLink
                },
            });
        }, duration);
    };


    // Проверка, есть ли товар в корзине
    useEffect(() => {
        const checkIfExists = async () => {
            if (isAuthenticated && card.id) {
                const exists = await checkIfExistsInBasket(card.id);
                setIsInBasket(exists);
            } else if (!isAuthenticated) {
                // Проверяем наличие товара в localStorage
                const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
                const exists = existingCart.some((item: CardData) => item.uuid === card.uuid);
                setIsInBasket(exists);
            }
        };

        if (registerCheckIfExists) {
            registerCheckIfExists(checkIfExists);
        }
        checkIfExists();
    }, [card, isAuthenticated]);


    // Добавление в корзину
    const handleBasketAdd = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            // Сохранение в localStorage
            const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const updatedCart = [...existingCart, card];
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            setIsInBasket(true);
            addProductToCart(); // Обновление UI (например, счетчика товаров в корзине)
        } else {
            // Логика для авторизованных пользователей
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


    // Удаление из корзины
    const handleDeletion = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            // Удаление из localStorage
            const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const updatedCart = existingCart.filter((item: CardData) => item.uuid !== card.uuid);
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            setIsInBasket(false);
            removeProductFromCart(1);
        } else {
            // Логика для авторизованных пользователей
            await deleteProductFromBasket(card.id);
            onChange(null, card.uuid);
            setIsInBasket(false);
            removeProductFromCart(1);
        }
    };


    return (
        <>
            <div className={styles.boutiqueCard} onClick={openModal}>
                <Image key={card.image}
                       src={isImageLoading ? "/images/coin-blur.webp" : card.image}
                       alt={card.name}
                       width={320}
                       height={375}
                       loading={"lazy"}
                       placeholder={"blur"}
                       blurDataURL={"/images/coin-blur.webp"}
                       onLoad={() => setIsImageLoading(false)}
                       onError={() => setIsImageLoading(false)}/>
                <span>{card.name}</span>
                <div className={styles.addToBasket} onClick={e => e.stopPropagation()}>
                    <span>{card.price}</span>
                    {availableToAdd && (
                        <>
                            {isInBasket &&
                                <button className={styles.sendButton}><Image src={'/images/shooting_star.svg'} alt={''}
                                                                             width={50} height={50}
                                                                             onClick={isInBasket && isAuthenticated ? confirmSend : openAuthModal}/>
                                </button>
                            }
                            <button className={styles.addButton}
                                    onClick={isInBasket ? handleDeletion : handleBasketAdd}>
                                {isInBasket ? '✓' : '+'}
                            </button>
                        </>
                    )}
                </div>
            </div>
            {showAnimation &&
                <SuccessAnimation background={backgroundImage} onVideoDuration={handleVideoDuration}/>
            }
        </>
    );
};

export default BoutiqueCard;
