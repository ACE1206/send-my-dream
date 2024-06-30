import React, {useEffect, useState} from "react";
import styles from "../../styles/Boutique.module.scss";
import Header from "../../components/Header/Header";
import {CardData, CategoryData} from "../../utils/types";
import {getCategories, getProductsByCategory} from "../../utils/api";
import Category from "../../components/Category/Category";
import BoutiqueCard from "../../components/BoutiqueCard/BoutiqueCard";
import BoutiqueCardModal from "../../components/BoutiqueCard/BoutiqueCardModal";
import Cards from "../../components/Cards/BoutiqueCards";
import MobileCarousel from "../../components/Slider/MobileCarousel";
import Select from "../../components/input/Select";
import MobileMenu from "../../components/Menu/MobileMenu";
import Head from "next/head";

const Boutique: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [placeholder, setPlaceholder] = useState<CategoryData | null>(null);
    const [boutiqueCards, setBoutiqueCards] = useState<CardData[]>([]);

    useEffect(() => {
        updateCategoryList();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            updateCardsList(selectedCategory.id);
        }
    }, [selectedCategory]);

    const updateCategoryList = async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
            if (categoriesData.length > 0) {
                setPlaceholder(categoriesData[0]);
                setSelectedCategory(categoriesData[0]);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const updateCardsList = async (categoryId: number) => {
        try {
            const cardData = await getProductsByCategory(categoryId);
            setBoutiqueCards(cardData);
        } catch (error) {
            console.error("Failed to fetch cards:", error);
        }
    };

    const handleSelect = (category: CategoryData) => {
        setSelectedCategory(category);
    };

    return (
        <div className={styles.boutique}>
            <Head>
                <title>Boutique</title>
            </Head>
            <Header/>
            <section>
                <Cards/>
                <div className={styles.categories}>
                    {categories.map((category) => (
                        <Category
                            key={category.id}
                            {...category}
                            chooseCategory={() => handleSelect(category)}
                            isSelected={selectedCategory?.id === category.id}
                        />
                    ))}
                </div>
                {placeholder && (
                    <Select
                        options={categories}
                        placeholder={placeholder}
                        onSelect={handleSelect}
                    />
                )}
                <div className={styles.boutiqueCards}>
                    {boutiqueCards && boutiqueCards.map((boutiqueCard) => (
                        <BoutiqueCard
                            key={boutiqueCard.id}
                            {...boutiqueCard}
                            openModal={() => setSelectedProduct(boutiqueCard)}
                        />
                    ))}
                </div>
                <MobileCarousel cards={boutiqueCards}/>
                {selectedProduct && (
                    <BoutiqueCardModal
                        boutiqueProps={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}
            </section>
            <MobileMenu/>
        </div>
    );
};

export default Boutique;
