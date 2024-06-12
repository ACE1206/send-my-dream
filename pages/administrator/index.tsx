import styles from '../../styles/AdminContent.module.scss';
import React, {useState, useEffect} from "react";
import Header from "../../components/Header/Header";
import AdministratorMenu from "../../components/Menu/AdministratorMenu";
import {content} from "../../data/admin_menu";
import categories from '../../data/categories.json';
import Category from "../../components/Category/Category";
import Image from "next/image";
import BoutiqueCard from "../../components/BoutiqueCard/BoutiqueCard";
import {CardData, CategoryData} from "../../utils/types";
import MobileMenu from "../../components/Menu/MobileMenu";
import CreateDream from "../../components/Modal/CreateDream";
import {getCategories, getDreams} from "../../utils/api";
import withAuth from "../../components/HOC/withAuth";
import CreateCategory from "../../components/Modal/CreateCategory";

const Content: React.FC = () => {
    const [dreams, setDreams] = useState<CardData[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

    useEffect(() => {
        updateCategoryList()
        updateDreamList();
    }, []);

    const updateDreamList = async () => {
        try {
            const dreamsData = await getDreams();
            setDreams(dreamsData);
        } catch (error) {
            console.error("Failed to fetch dreams:", error);
        }
    };

    const updateCategoryList = async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const newProduct: CardData = {
        name: '',
        description: '',
        price: 0,
        image: '',
    };

    const newCategory: CategoryData = {
        name: '',
        image: '',
    };

    return (
        <div className={styles.content}>
            <Header/>
            <section>
                <h1>Administrator Settings</h1>
                <AdministratorMenu {...content} />
                <div className={styles.categories}>
                    {categories.map((category, index: React.Key) => (
                        <Category key={index} {...category} chooseCategory={() => setSelectedCategory(category)}/>
                    ))}
                    <button className={styles.addCategory} onClick={() => setSelectedCategory(newCategory)}>
                        <Image src="/images/plus-button.png" alt="" width={42} height={42}/>Add
                    </button>
                </div>
                <div className={styles.cards}>
                    {dreams.map((card, index: React.Key) => (
                        <BoutiqueCard key={index} {...card} openModal={() => setSelectedProduct(card)}/>
                    ))}
                    <button className={styles.addCard} onClick={() => setSelectedProduct(newProduct)}>
                        ADD<Image src="/images/plus-button.png" alt="" width={100} height={100}/>
                    </button>
                </div>
                {selectedProduct && (
                    <CreateDream
                        {...selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        updateList={updateDreamList}
                    />
                )}
                {selectedCategory && (
                    <CreateCategory onClose={() => setSelectedCategory(null)} updateList={updateCategoryList}
                                    id={selectedCategory.id} name={selectedCategory.name}
                                    image={selectedCategory.image}/>
                )}
            </section>
            <MobileMenu/>
        </div>
    );
};

export default withAuth(Content);
