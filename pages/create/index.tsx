import React, { useState, useEffect } from "react";
import styles from "../../styles/Create.module.scss";
import Header from "../../components/Header/Header";
import Cards from "../../components/Cards/BoutiqueCards";
import BoutiqueCard from "../../components/BoutiqueCard/BoutiqueCard";
import BoutiqueCardModal from "../../components/BoutiqueCard/BoutiqueCardModal";
import { CardData } from "../../utils/types";
import MobileCarousel from "../../components/Slider/MobileCarousel";
import MobileMenu from "../../components/Menu/MobileMenu";
import { generateImage } from "../../utils/api";
import { openDB, IDBPDatabase } from 'idb';
import imageCompression from 'browser-image-compression';
import { v4 as uuidv4 } from 'uuid';

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

if (typeof window !== 'undefined') {
    dbPromise = openDB('images-store', 1, {
        upgrade(db) {
            db.createObjectStore('images', { keyPath: 'id' });
        },
    });
}

const compressImage = async (dataUrl: string) => {
    const blob = await (await fetch(dataUrl)).blob();
    const compressedBlob = await imageCompression(blob as File, { maxSizeMB: 0.1, maxWidthOrHeight: 800 });
    const compressedDataUrl = await imageCompression.getDataUrlFromFile(compressedBlob);
    return compressedDataUrl;
};

const storeImage = async (id: string, dataUrl: string) => {
    if (dbPromise) {
        const db = await dbPromise;
        const tx = db.transaction('images', 'readwrite');
        await tx.objectStore('images').put({ id, dataUrl }); // убрал параметр id
        await tx.done;
    }
};


const getImage = async (id: string) => {
    if (dbPromise && id) {
        const db = await dbPromise;
        const tx = db.transaction('images', 'readonly');
        const result = await tx.objectStore('images').get(id);
        return result ? result.dataUrl : null;
    }
    return null;
};

const saveCardsToLocalStorage = (cards: CardData[]) => {
    if (typeof window !== 'undefined' && cards.length > 0) {
        localStorage.setItem('cards', JSON.stringify(cards));
    }
};

const saveCardsToIndexedDB = async (cards: CardData[]) => {
    if (dbPromise) {
        const db = await dbPromise;
        const tx = db.transaction('images', 'readwrite');
        const store = tx.objectStore('images');
        await Promise.all(cards.map(async (card) => {
            if (card.image) {
                await store.put({ id: card.id, dataUrl: card.image }); // убрал параметр id
            }
        }));
        await tx.done;
    }
};

const Create: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [cards, setCards] = useState<CardData[]>([]);

    useEffect(() => {
        const loadSavedCards = async () => {
            if (typeof window !== 'undefined') {
                const savedCards = localStorage.getItem('cards');
                if (savedCards) {
                    const parsedCards = JSON.parse(savedCards);
                    const loadedCards = await Promise.all(parsedCards.map(async (card: CardData) => {
                        const image = await getImage(card.id);
                        return { ...card, image: image || card.image };
                    }));
                    setCards(loadedCards);
                }
            }
        };
        loadSavedCards();
    }, []);

    useEffect(() => {
        if (cards.length > 0) {
            const saveData = async () => {
                saveCardsToLocalStorage(cards);
                await saveCardsToIndexedDB(cards);
            };
            saveData();
        }
    }, [cards]);

    const handleGenerateImages = async (e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            for (let i = 0; i < 4; i++) {
                const result = await generateImage(query);
                const image = result.image;
                const compressedDataUrl = await compressImage(`data:image/png;base64,${image}`);

                const id = uuidv4();
                await storeImage(id, compressedDataUrl);

                const newCard = {
                    id,
                    image: compressedDataUrl,
                    name: query,
                    price: 2,
                    description: '',
                    ai: false
                };

                setCards((prevCards) => [...prevCards, newCard]);
            }
        } catch (error) {
            console.error('Error generating images:', error);
        }
        setLoading(false);
    };

    const changeStatus = (id: string) => {
        setCards((prevCards) =>
            prevCards.map((card) =>
                card.id === id ? { ...card, ai: !card.ai } : card
            )
        );
    };

    const handleQueryChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    return (
        <div className={styles.create}>
            <Header />
            <section>
                <Cards />
                <form>
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
                            'Create'
                        )}
                    </button>
                </form>
                {cards.length > 0 && (
                    <div className={styles.boutiqueCards}>
                        {cards.map((card) => (
                            <BoutiqueCard
                                key={card.id}
                                {...card}
                                openModal={() => setSelectedProduct(card)}
                                onChange={() => changeStatus(card.id)}
                            />
                        ))}
                    </div>
                )}
                {cards.length > 0 && <MobileCarousel cards={cards} />}
                {selectedProduct && (
                    <BoutiqueCardModal boutiqueProps={selectedProduct} onClose={() => setSelectedProduct(null)} />
                )}
            </section>
            <MobileMenu />
        </div>
    );
};

export default Create;
