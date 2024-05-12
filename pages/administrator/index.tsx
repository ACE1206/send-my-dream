import styles from '../../styles/AdminContent.module.scss'
import React, {useState} from "react";
import Header from "../../components/Header/Header";
import AdministratorMenu from "../../components/Menu/AdministratorMenu";
import {content} from "../../data/admin_menu";
import categories from '../../data/categories.json'
import Category from "../../components/Category/Category";
import Image from "next/image";
import {boutiqueCards} from "../../data/boutique_cards";
import BoutiqueCard from "../../components/BoutiqueCard/BoutiqueCard";
import {CardData, CategoryData} from "../../utils/types";
import BoutiqueCardModal from "../../components/BoutiqueCard/BoutiqueCardModal";
import MobileMenu from "../../components/Menu/MobileMenu";

const Content: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

    return (
        <div className={styles.content}>
            <Header/>
            <section>
                <h1>Administrator Settings</h1>
                <AdministratorMenu {...content} />
                <div className={styles.categories}>
                    {categories.map((category, index: React.Key) => (
                        <div key={index} className={styles.categoryContainer}>
                            <Category {...category} chooseCategory={() => setSelectedCategory(category)}/>
                            <button className={styles.removeCategory}>x</button>
                        </div>
                    ))}
                    <button className={styles.addCategory}><Image src="/plus-button.png" alt="" width={42} height={42}/>Add</button>
                </div>
                <div className={styles.cards}>
                    {boutiqueCards.map((card, index: React.Key) => (
                            <BoutiqueCard {...card} openModal={() => setSelectedProduct(card)}/>
                    ))}
                    {selectedProduct && <BoutiqueCardModal boutiqueProps={selectedProduct} onClose={() => setSelectedProduct(null)}/>}
                    <button className={styles.addCard}>ADD<Image src="/plus-button.png" alt="" width={100} height={100}/></button>
                </div>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default Content
