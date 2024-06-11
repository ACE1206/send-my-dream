import React, {useState} from "react";
import styles from "../../styles/Create.module.scss"
import Header from "../../components/Header/Header";
import Cards from "../../components/Cards/BoutiqueCards";
import BoutiqueCard from "../../components/BoutiqueCard/BoutiqueCard";
import BoutiqueCardModal from "../../components/BoutiqueCard/BoutiqueCardModal";
import {CardData} from "../../utils/types";
import MobileCarousel from "../../components/Slider/MobileCarousel";
import MobileMenu from "../../components/Menu/MobileMenu";
import {generateImages} from "../../utils/api";

const Create: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [cards, setCards] = useState<CardData[]>([])

    const handleGenerateImages = async () => {
        setLoading(true);
        const allCards = [...cards];
        try {
            const result = await generateImages(query);
            result.map((im: any) => {
                allCards.push({image: `data:image/png;base64,${im}`, name: query, price: 5, description: ''})
            })
            setCards(allCards)
        } catch (error) {
            console.error('Error generating images:', error);
        }
        setLoading(false);
    };

    const handleQueryChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    return (
        <div className={styles.create}>
            <Header/>
            <section>
                <Cards/>
                <form action="/">
                    <input type="text" value={query}
                           placeholder="Write your dream" onChange={handleQueryChange(setQuery)}/>
                    <button onClick={handleGenerateImages} disabled={loading}>
                        {loading ? (
                            <div className={styles.spinner}></div>
                        ) : (
                            'Create'
                        )}
                    </button>
                </form>
                {cards &&
                    <div className={styles.boutiqueCards}>
                        {cards.map((card, index: React.Key) => (
                            <BoutiqueCard key={index} {...card}
                                          openModal={() => setSelectedProduct(card)}/>
                        ))}
                    </div>
                }
                {cards && <MobileCarousel cards={cards}/>}
                {selectedProduct &&
                    <BoutiqueCardModal boutiqueProps={selectedProduct} onClose={() => setSelectedProduct(null)}/>}
            </section>
            <MobileMenu/>
        </div>
    )
}

export default Create;
