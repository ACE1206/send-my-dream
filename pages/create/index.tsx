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
import {useAuth} from "../../components/Auth/AuthContext";
import AiCard from "../../components/BoutiqueCard/AiCard";
import WavesCard from "../../components/BoutiqueCard/WavesCard";

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
    const [count, setCount] = useState<number>(null);
    const [selectedAi, setSelectedAi] = useState({
        name: "ChatGPT",
        img: "/images/gpt.webp"
    });
    const [user, setUser] = useState<any>(null);
    const checkIfExistsRefs = useRef<(() => void)[]>([]);
    const [error, setError] = useState<string>(null)
    const [isMobile, setIsMobile] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const {openAuthModal} = useAuth();

    useEffect(() => {
        updateUser();
    }, []);


    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1366px)");

        const handleMediaQueryChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        setIsMobile(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, []);


    const updateUser = async () => {
        const savedCards = getCardsFromLocalStorage();
        try {
            const fetchUser = await getUserData();
            setUser(fetchUser);
            if (fetchUser.generations) {
                setCount(fetchUser.generations)
            }
            const fetchCards = await getAiProducts(fetchUser.id);
            setCards(fetchCards);
            setIsClient(true);
        } catch (e) {
            setCards(savedCards);
            setCount(20 - savedCards.length)
            setIsClient(true);
        }
    };

    useEffect(() => {
        if (!user && cards.length > 0) {
            saveCardsToLocalStorage(cards);
        }
        setLoadingCard(false);
    }, [cards, user]);

    const handleSelectAi = () => {
        setSelectedAi(prevAi => prevAi.name === "ChatGPT" ? {
            name: "FusionBrain",
            img: "/images/fusion.webp"
        } : {
            name: "ChatGPT",
            img: "/images/gpt.webp"
        });
    };

    const handleGenerateImages = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (query === '') {
            return false;
        }
        if (!user && cards.length >= 20) {
            openAuthModal();
        } else if (user && user.generations === 0) {
            setCountError(true);
        } else {
            setLoading(true);
            setLoadingCard(true);
            try {
                const result = await generateImage(query, selectedAi.name, 1, user && user.id);
                const image = result.image;

                const newCard: CardData = {
                    uuid: uuidv4(),
                    image,
                    name: query,
                    price: 1,
                    description: '',
                };

                setLoadingCard(false);

                setCards(prevCards => {
                    const updatedCards = [...prevCards, newCard];
                    saveCardsToLocalStorage(updatedCards);
                    return updatedCards;
                });
            } catch (error) {
                setLoadingCard(false);
                setError(error.message);
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

    const handleAiCardClick = () => {
        if (inputRef.current) {
            inputRef.current.focus(); // Фокусируемся на input
            inputRef.current.classList.add(styles["input-placeholder-animated"]); // Добавляем анимацию placeholder
            setTimeout(() => {
                inputRef.current?.classList.remove(styles["input-placeholder-animated"]);
            }, 1500); // Длительность анимации
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
                                ref={inputRef}
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
                                    count && count > 0 ? (`Create (${count})`) : `Create`
                                )}
                            </button>
                        </form>
                        <div className={styles.boutiqueCards}>
                            {loadingCard && <LoadingCard/>}
                            {cards.length > 0 ? (cards.slice().reverse().map((card, index) => (
                                <BoutiqueCard
                                    key={index}
                                    card={card}
                                    openModal={() => !isMobile && setSelectedProduct(card)}
                                    onChange={(id) => changeStatus(id, card.uuid)}
                                    registerCheckIfExists={registerCheckIfExists}
                                />
                            ))) : (
                                <AiCard onClick={handleAiCardClick}/>
                            )}
                        </div>
                        {/*{cards && (*/}
                        {/*    <MobileCarousel registerCheckIfExists={registerCheckIfExists} cards={cards}*/}
                        {/*                    loading={loadingCard}*/}
                        {/*                    onChange={changeStatus}/>*/}
                        {/*)}*/}
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
