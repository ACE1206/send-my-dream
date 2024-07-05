import React, {useState, useEffect} from "react";
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

const compressImage = async (dataUrl: string) => {
    const blob = await (await fetch(dataUrl)).blob();
    const compressedBlob = await imageCompression(blob as File, {maxSizeMB: 0.1, maxWidthOrHeight: 800});
    const compressedDataUrl = await imageCompression.getDataUrlFromFile(compressedBlob);
    return compressedDataUrl;
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
    const [loading, setLoading] = useState(false);
    const [loadingCard, setLoadingCard] = useState(false);
    const [query, setQuery] = useState('');
    const [cards, setCards] = useState<CardData[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [selectedAi, setSelectedAi] = useState("ChatGPT");
    const [user, setUser] = useState(null);

    useEffect(() => {
        updateUser()
    }, []);

    const updateUser = async () => {
        try {
        const fetchUser = await getUserData();
            setUser(fetchUser);
            const fetchCards = await getAiProducts(fetchUser.id)
            setCards(fetchCards)
            setIsClient(true);
        } catch (e) {
            if (typeof window !== 'undefined') {
                const savedCards = getCardsFromLocalStorage();
                setCards(savedCards);
                setIsClient(true);
            }
        }
    }

    useEffect(() => {
        if (!user) {
            if (cards.length > 0) {
                saveCardsToLocalStorage(cards);
            }
        }
    }, [cards]);

    const handleGenerateImages = async (e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);
        setLoadingCard(true)
        try {
            const result = await generateImage(query, selectedAi, 2);
            const image = result.image;

            const newCard: CardData = {
                uuid: uuidv4(),
                image: image,
                name: query,
                price: 2,
                description: '',
            };

            setCards((prevCards) => [...prevCards, newCard]);
            setLoadingCard(false)
        } catch (error) {
            console.error('Error generating images:', error);
        }
        if (user) {
            updateUser()
        }
        setLoading(false);
    };

    const changeStatus = (productId: number | null, uuid: string) => {
        setCards((prevCards) =>
            prevCards.map((item) => {
                if (item.uuid === uuid) {
                    if (productId !== null) {
                        return {...item, id: productId};
                    } else {
                        const {id, ...rest} = item;
                        return {...rest};
                    }
                }
                return item;
            })
        );
    };

    const handleAiChange = (e: { preventDefault: () => void; }, ai: string) => {
        e.preventDefault()
        setSelectedAi(ai)
    }

    const handleQueryChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className={styles.create}>
            <Head>
                <title>Create With AI</title>
            </Head>
            <Header/>
            <section className={styles.content}>
                <Cards/>
                <form>
                    <div className={styles.buttons}>
                        <button className={selectedAi === "ChatGPT" ? styles.selected : ``}
                                onClick={(e) => handleAiChange(e, `ChatGPT`)}><Image src={"/images/gpt.png"} alt={""}
                                                                                     width={300}
                                                                                     height={300}/>
                        </button>
                        <button className={selectedAi === "FusionBrain" ? styles.selected : ``}
                                onClick={(e) => handleAiChange(e, `FusionBrain`)}><Image src={"/images/fusion.png"}
                                                                                         alt={""} width={300}
                                                                                         height={300}/>
                        </button>
                    </div>
                    <div className={styles.input}>
                        <input
                            type="text"
                            value={query}
                            placeholder="Write your dream"
                            onChange={handleQueryChange(setQuery)}
                        />
                        <button onClick={handleGenerateImages} disabled={loading}>
                            {loading ? (
                                <div className={styles.spinner}></div>
                            ) : (
                                <>
                                    {user && user.generations ? (`Create x${user.generations}`) : `Create`}
                                </>
                            )}
                        </button>
                    </div>
                </form>
                {cards.length > 0 && (
                    <div className={styles.boutiqueCards}>
                        {cards.map((card, index) => (
                            <BoutiqueCard
                                key={index}
                                {...card}
                                openModal={() => setSelectedProduct(card)}
                                onChange={(id) => changeStatus(id, card.uuid)}
                            />
                        ))}
                        {loadingCard &&
                            <LoadingCard/>
                        }
                    </div>
                )}
                {cards && <MobileCarousel cards={cards} loading={loadingCard}
                                          onChange={(id, uuid) => changeStatus(id, uuid)}/>}
                {selectedProduct && (
                    <BoutiqueCardModal boutiqueProps={selectedProduct} onClose={() => setSelectedProduct(null)}
                                       onChange={(id) => changeStatus(id, selectedProduct.uuid)}/>
                )}
            </section>
            <MobileMenu/>
        </div>
    );
};

export default Create;
