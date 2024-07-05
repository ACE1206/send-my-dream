import styles from "./BoutiqueCardModal.module.scss"
import {ModalProps} from "../../utils/types";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import {useAuth} from "../Auth/AuthContext";
import {addProductToBasket, checkIfExistsInBasket, deleteProductFromBasket} from "../../utils/api";
import GenerateLink from "../Generation/GenerateLink";

const Modal: React.FC<ModalProps & {
        availableToAdd?: boolean,
        onChange?: (id: number | null, isInBasket: boolean) => void;
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
        const [authModalOpen, setAuthModalOpen] = useState(false);
        const [isInBasket, setIsInBasket] = useState(false);
        const [loaded, setLoaded] = useState(false)
        const [loadedId, setLoadedId] = useState(boutiqueProps.id || null)

        const {isAuthenticated} = useAuth();

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

        const handleBasketAdd = async (e: React.MouseEvent) => {
            e.preventDefault();
            if (!isAuthenticated) {
                setAuthModalOpen(true);
            } else {
                const data = new FormData();
                if (boutiqueProps.category) {
                    data.append("category", boutiqueProps.category.id.toString());
                }
                if (isBase64(boutiqueProps.image)) {
                    data.append("image", base64ToBlob(boutiqueProps.image));
                }
                data.append("name", boutiqueProps.name);
                data.append("description", boutiqueProps.description);
                data.append("price", boutiqueProps.price.toString());
                e.stopPropagation();
                const productId = await addProductToBasket(data);
                if (productId && onChange) {
                    setLoadedId(productId);
                    setIsInBasket(true);
                    onChange(productId, true);
                }
            }
        }

        const handleDeletion = async (e: React.MouseEvent) => {
            e.stopPropagation();
            await deleteProductFromBasket(loadedId);
            setIsInBasket(false);
            if (onChange) {
                onChange(null, false);
            }
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
                            {/*<h2>{boutiqueProps.name}</h2>*/}
                            {/*<p>{boutiqueProps.description}</p>*/}
                            <div className={styles.addToBasket}>
                                {!availableToShare ? (
                                    <></>
                                    // <span>{boutiqueProps.price}</span>
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
