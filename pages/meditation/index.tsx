import styles from "../../styles/Meditation.module.scss"
import React, {useState} from "react";
import Header from "../../components/Header/Header";
import Image from "next/image";
import MotivationCards from "../../components/Cards/MotivationCards";
import {meditationCards} from "../../data/meditation_cards";
import BoutiqueCard from "../../components/BoutiqueCard/BoutiqueCard";
import {MeditationData} from "../../utils/types";
import MeditationModal from "../../components/Modal/PurchaseModal";
import MobileCarousel from "../../components/Slider/MobileCarousel";
import MobileMenu from "../../components/Menu/MobileMenu";
import Head from "next/head";

const Meditation: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<MeditationData | null>(null);

    return (
        <div className={styles.meditation}>
            <Head>
                <title>Meditation</title>
            </Head>
            <Header/>
            <section>
                <MotivationCards/>
                <div className={`${styles.cards} hide-on-mobile`}>
                    {meditationCards.map((card, index: React.Key) => (
                        <BoutiqueCard key={index} {...card} openModal={() => setSelectedProduct(card)}/>
                    ))}
                    {selectedProduct && <MeditationModal {...selectedProduct} video={"https://www.youtube.com/watch?v=KcU6w1Pr5gc"} onClose={() => setSelectedProduct(null)}/>}
                </div>
                <MobileCarousel cards={meditationCards}/>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default Meditation
