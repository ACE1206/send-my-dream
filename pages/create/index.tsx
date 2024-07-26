import React, {useState, useEffect, useRef} from "react";
import styles from "../../styles/Create.module.scss";
import Header from "../../components/Header/Header";
import Cards from "../../components/Cards/BoutiqueCards";
import BoutiqueCard from "../../components/BoutiqueCard/BoutiqueCard";
import BoutiqueCardModal from "../../components/BoutiqueCard/BoutiqueCardModal";
import {CardData} from "../../utils/types";
import MobileCarousel from "../../components/Slider/MobileCarousel";
import MobileMenu from "../../components/Menu/MobileMenu";
import {generateImage, getAiProducts, getUserData} from "../../utils/api";
import imageCompression from 'browser-image-compression';
import {v4 as uuidv4} from 'uuid';
import Head from "next/head";
import LoadingCard from "../../components/BoutiqueCard/LoadingCard";
import Image from "next/image";
import AuthModal from "../../components/Modal/AuthModal";
import BuyGenerationsModal from "../../components/Modal/BuyGenerations";
import ErrorModal from "../../components/Modal/ErrorModal";
import {useAuthModal} from "../../components/Auth/AuthModalContext";

const compressImage = async (dataUrl: string) => {
    const blob = await (await fetch(dataUrl)).blob();
    const compressedBlob = await imageCompression(blob as File, {maxSizeMB: 0.1, maxWidthOrHeight: 800});
    return await imageCompression.getDataUrlFromFile(compressedBlob);
};

const saveCardsToLocalStorage = (cards: CardData[]) => {
    if (typeof window !== 'undefined' && cards.length > 0) {
        localStorage.setItem('cards', JSON.stringify(cards));
    }
};

const getCardsFromLocalStorage = (): CardData[] => {
    if (typeof window !== 'undefined') {
        const savedCards = localStorage.getItem('cards');
        return savedCards ? JSON.parse(savedCards) : [];
    }
    return [];
};

const Create: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);
    const [unauthorizedError, setUnauthorizedError] = useState(false);
    const [countError, setCountError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingCard, setLoadingCard] = useState(false);
    const [query, setQuery] = useState<string>('');
    const [cards, setCards] = useState<CardData[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [selectedAi, setSelectedAi] = useState({
        name: "ChatGPT",
        img: "/images/gpt.png"
    });
    const [user, setUser] = useState<any>(null);
    const checkIfExistsRefs = useRef<(() => void)[]>([]);
    const [error, setError] = useState<string>(null)

    const {openAuthModal} = useAuthModal();

    useEffect(() => {
        updateUser();
    }, []);

    const updateUser = async () => {
        const savedCards = getCardsFromLocalStorage();
        try {
            const fetchUser = await getUserData();
            setUser(fetchUser);
            const fetchCards = await getAiProducts(fetchUser.id);
            // setCards([...fetchCards, ...savedCards]);
            setCards(fetchCards);
            setIsClient(true);
        } catch (e) {
            setCards(savedCards);
            setIsClient(true);
        }
    };

    useEffect(() => {
        if (!user && cards.length > 0) {
            saveCardsToLocalStorage(cards);
        }
    }, [cards, user]);

    const handleSelectAi = () => {
        setSelectedAi(prevAi => prevAi.name === "ChatGPT" ? {
            name: "FusionBrain",
            img: "/images/fusion.png"
        } : {
            name: "ChatGPT",
            img: "/images/gpt.png"
        });
    };

    const handleGenerateImages = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user && cards.length >= 20) {
            openAuthModal();
        } else if (user && user.generations === 0) {
            setCountError(true);
        } else {
            setLoading(true);
            setLoadingCard(true);
            try {
                const result = await generateImage(query, selectedAi.name, 2, user && user.id);
                const image = result.image;

                const newCard: CardData = {
                    uuid: uuidv4(),
                    image,
                    name: query,
                    price: 2,
                    description: '',
                };

                setCards(prevCards => {
                    const updatedCards = [...prevCards, newCard];
                    saveCardsToLocalStorage(updatedCards);
                    return updatedCards;
                });

                setLoadingCard(false);
            } catch (error) {
                setError(error.message)
            }
            updateUser();
            setLoading(false);
        }
    };

    const registerCheckIfExists = (checkFunction: () => void) => {
        checkIfExistsRefs.current.push(checkFunction);
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const changeStatus = (productId: number | null, uuid: string) => {
        if (user) {
            setCards(prevCards => {
                const updatedCards = prevCards.map(item => {
                    if (item.id === productId) {
                        return {...item, id: productId || undefined};
                    }
                    return item;
                });
                saveCardsToLocalStorage(updatedCards);
                checkIfExistsRefs.current.forEach(checkFunction => checkFunction());
                return updatedCards;
            });
        } else {
            setCards(prevCards => {
                const updatedCards = prevCards.map(item => {
                    if (item.uuid === uuid) {
                        return {...item, id: productId || undefined};
                    }
                    return item;
                });
                saveCardsToLocalStorage(updatedCards);
                return updatedCards;
            });
        }
    };

    return (
        <div className={styles.create}>
            <Head>
                <title>Create With AI</title>
            </Head>
            <Header/>
            <section className={styles.content}>
                <Cards/>
                {isClient &&
                    <>
                        <form>
                            <div className={styles.buttons} onClick={handleSelectAi}>
                                <Image src={selectedAi.img} alt={selectedAi.name} width={60} height={60}/>
                            </div>
                            <input
                                type="text"
                                value={query}
                                placeholder="Write your dream"
                                onChange={handleQueryChange}
                                maxLength={35}
                            />
                            <button onClick={handleGenerateImages} disabled={loading}>
                                {loading ? (
                                    <div className={styles.spinner}>
                                        <div className={styles.dot}></div>
                                        <div className={styles.dot}></div>
                                        <div className={styles.dot}></div>
                                        <div className={styles.dot}></div>
                                        <div className={styles.dot}></div>
                                    </div>
                                ) : (
                                    user && user.generations ? (`Create (${user.generations})`) : `Create`
                                )}
                            </button>
                        </form>
                        <div className={styles.boutiqueCards}>
                            {loadingCard && <LoadingCard/>}
                            {cards.length > 0 && [...cards].reverse().map((card, index) => (
                                <BoutiqueCard
                                    key={index}
                                    card={card}
                                    openModal={() => setSelectedProduct(card)}
                                    onChange={(id) => changeStatus(id, card.uuid)}
                                    registerCheckIfExists={registerCheckIfExists}
                                />
                            ))}
                        </div>
                        {cards && (
                            <MobileCarousel registerCheckIfExists={registerCheckIfExists} cards={cards}
                                            loading={loadingCard}
                                            onChange={changeStatus}/>
                        )}
                        {selectedProduct && (
                            <BoutiqueCardModal
                                boutiqueProps={selectedProduct}
                                onClose={() => setSelectedProduct(null)}
                                onChange={changeStatus}
                            />
                        )}
                    </>
                }
            </section>
            {countError &&
                <BuyGenerationsModal balance={user && user.balance} userId={user && user.id} onClose={() => {
                    updateUser();
                    setCountError(false);
                }}/>}
            {error &&
                <ErrorModal onClose={() => setError(null)} title={error} text={"Try again"} buttonText={'Try again'}/>
            }
            <MobileMenu/>
        </div>
    );
};

export default Create;
