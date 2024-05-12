import React, {useState} from "react";
import styles from "../../styles/Create.module.scss"
import Header from "../../components/Header/Header";
import Cards from "../../components/Cards/BoutiqueCards";
import {aiCards} from "../../data/ai_cards";
import BoutiqueCard from "../../components/BoutiqueCard/BoutiqueCard";
import BoutiqueCardModal from "../../components/BoutiqueCard/BoutiqueCardModal";
import {CardData} from "../../utils/types";
import MobileCarousel from "../../components/Slider/MobileCarousel";
import MobileMenu from "../../components/Menu/MobileMenu";

const Create: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);

    return (
        <div className={styles.create}>
            <Header/>
            <section>
                <Cards/>
                <form action="/">
                    <input type="text" placeholder="Write your dream"/>
                    <button>Create!</button>
                </form>
                <div className={styles.boutiqueCards}>
                    {aiCards.map((boutiqueCard, index: React.Key) => (
                        <BoutiqueCard key={index} {...boutiqueCard} openModal={() => setSelectedProduct(boutiqueCard)}/>
                    ))}
                </div>
                <MobileCarousel cards={aiCards}/>
                {selectedProduct &&
                    <BoutiqueCardModal boutiqueProps={selectedProduct} onClose={() => setSelectedProduct(null)}/>}
            </section>
            <MobileMenu/>
        </div>
    )
}

export default Create;
