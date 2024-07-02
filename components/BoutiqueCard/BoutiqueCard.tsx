import styles from "./BoutiqueCard.module.scss"
import React, {useState, useEffect} from "react";
import Image from "next/image";
import {CardData, CardProps} from "../../utils/types";
import {useAuth} from "../Auth/AuthContext";
import AuthModal from "../Modal/AuthModal";
import {addProductToBasket, checkIfExistsInBasket, deleteProductFromBasket, getUserData} from "../../utils/api";

const BoutiqueCard: React.FC<CardProps & { availableToAdd?: boolean, onChange?: (id: number | null, isInBasket: boolean) => void }> = ({
                                                                                                     id,
                                                                                                     image,
                                                                                                     category,
                                                                                                     video,
                                                                                                     name,
                                                                                                     description,
                                                                                                     price,
                                                                                                     openModal,
                                                                                                     availableToAdd = true,
                                                                                                     onChange
                                                                                                 }) => {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [isInBasket, setIsInBasket] = useState(false);
    const [loaded, setLoaded] = useState(false)

    const {isAuthenticated} = useAuth();

    useEffect(() => {
        const checkIfExists = async () => {
            if (isAuthenticated) {
                if (id) {
                    try {
                        const exists = await checkIfExistsInBasket(id);
                        setIsInBasket(exists);
                    } catch (e) {
                        setIsInBasket(false);
                    }
                } else {
                    setIsInBasket(false)
                }
            }
            setLoaded(true);
        };

        checkIfExists();
    }, [id, isAuthenticated]);

    const base64ToBlob = (base64: string, contentType: string = ''): Blob => {
        const base64WithoutPrefix = base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

        const byteCharacters = atob(base64WithoutPrefix);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    };

    const isBase64 = (str: string): boolean => {
        const base64Pattern = /^data:image\/[a-zA-Z]+;base64,/;
        return base64Pattern.test(str);
    };

    const handleBasketAdd = async (e) => {
        e.stopPropagation()
        if (!isAuthenticated) {
            setAuthModalOpen(true);
        } else {
            const data = new FormData();
            if (id) {
                data.append("id", id.toString())
            }
            if (category) {
                data.append("category", category.id.toString())
            }
            if (isBase64(image)) {
                data.append("image", base64ToBlob(image))
            }
            data.append("name", name)
            data.append("description", description)
            data.append("price", price.toString())
            e.stopPropagation();
            const productId = await addProductToBasket(data);
            if (productId && onChange) {
                setIsInBasket(true);
                onChange(productId, true)
            }
        }
    }

    const handleDeletion = async (e) => {
        e.stopPropagation()
        await deleteProductFromBasket(id)
        setIsInBasket(false)
        if (onChange) {
            onChange(null, false)
        }
    }

    return (
        <>
            {loaded &&
                <div className={styles.boutiqueCard} onClick={() => {
                    const modalData: CardData = {image, name, description, price};
                    category ? modalData.category = category : modalData.video = video;
                    openModal(modalData);
                }}>
                    <Image src={image} alt={name} width={320} height={375}/>
                    <span>{name}</span>
                    <div className={styles.addToBasket}>
                        <span>{price}</span>
                        {availableToAdd &&
                            <button
                                    onClick={isInBasket ? handleDeletion : handleBasketAdd}>{isInBasket ? '✓' : '+'}</button>
                        }
                    </div>
                </div>
            }
            {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)}/>}
        </>
    )
};

export default BoutiqueCard;
