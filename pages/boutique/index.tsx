import React, {useState} from "react";
import styles from "../../styles/Boutique.module.scss";
import Header from "../../components/Header/Header";
import Image from "next/image";
import categories from "../../data/categories.json"
import {boutiqueCards} from "../../data/boutique_cards"
import Category from "../../components/Category/Category";
import BoutiqueCard from "../../components/BoutiqueCard/BoutiqueCard";
import {CardData, CategoryData} from "../../utils/types";
import BoutiqueCardModal from "../../components/BoutiqueCard/BoutiqueCardModal";
import Cards from "../../components/Cards/BoutiqueCards";
import MobileCarousel from "../../components/Slider/MobileCarousel";
import {aiCards} from "../../data/ai_cards";
import Select from "../../components/input/Select";
import MobileMenu from "../../components/Menu/MobileMenu";

const Boutique: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null)

    return (
        <div className={styles.boutique}>
            <Header/>
            <section>
                <Cards/>
                <div className={styles.categories}>
                    {categories.map((category, index: React.Key) => (
                        <Category key={index} link={category.link} img={category.img} text={category.text}
                                  alt={category.alt} chooseCategory={() => setSelectedCategory(category)}/>
                    ))}
                </div>
                <Select options={categories} placeholder={categories[0]}/>
                <div className={styles.boutiqueCards}>
                    {boutiqueCards.map((boutiqueCard, index: React.Key) => (
                        <BoutiqueCard key={index} {...boutiqueCard} openModal={() => setSelectedProduct(boutiqueCard)}/>
                    ))}
                </div>
                <MobileCarousel cards={boutiqueCards}/>
                {selectedProduct &&
                    <BoutiqueCardModal boutiqueProps={selectedProduct} onClose={() => setSelectedProduct(null)}/>}
            </section>
            <MobileMenu/>
        </div>
    )
};

export default Boutique;
