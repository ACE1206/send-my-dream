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
import {deleteCategory, deleteDream, getCategories, getDreams, getProductsByCategory} from "../../utils/api";
import withAuth from "../../components/HOC/withAuth";
import CreateCategory from "../../components/Modal/CreateCategory";
import {useRouter} from "next/router";
import ConfirmDelete from "../../components/Modal/ConfirmDelete";
import confirmDelete from "../../components/Modal/ConfirmDelete";
import Head from "next/head";

const Content: React.FC = () => {
    const [dreams, setDreams] = useState<CardData[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);
    const [handledCategory, setHandledCategory] = useState<CategoryData | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
    const [remove, setRemove] = useState<boolean>(false);
    const [deletedCategory, setDeletedCategory] = useState<number>(null);
    const [deletedDream, setDeletedDream] = useState<number>(null);
    const [isMobile, setIsMobile] = useState(false);

    const router = useRouter()

    useEffect(() => {
        updateCategoryList()
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            updateDreamList(selectedCategory.id);
        }
    }, [selectedCategory]);

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

    const updateCategoryList = async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
            if (categoriesData.length > 0) {
                setSelectedCategory(categoriesData[0]);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const updateDreamList = async (categoryId: number) => {
        try {
            const cardData = await getProductsByCategory(categoryId);
            setDreams(cardData);
        } catch (error) {
            console.error("Failed to fetch cards:", error);
        }
    };

    const handleDeleteDream = async (id) => {
        await deleteDream(id).then(() => {
            updateDreamList(selectedCategory.id)
            setDeletedDream(null)
        })
    }

    const handleDeleteCategory = async (id) => {
        await deleteCategory(id).then(() => {
            updateCategoryList()
            updateDreamList(selectedCategory.id)
            setDeletedCategory(null)
        })
    }

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

    useEffect(() => {
        if(deletedDream) {
            setSelectedProduct(null)
            setRemove(true)
        } else {
            setRemove(false)
        }
    }, [deletedDream]);

    useEffect(() => {
        if(deletedCategory) {
            setHandledCategory(null)
            setRemove(true)
        } else {
            setRemove(false)
        }
    }, [deletedCategory]);

    const closeConfirmDelete = () => {
        setDeletedCategory(null)
        setDeletedDream(null)
        setRemove(false)
    }

    return (
        <div className={styles.content}>
            <Head>
                <title>Content</title>
            </Head>
            <Header/>
            <section>
                <h1>Administrator Settings</h1>
                <AdministratorMenu {...content} />
                <div className={styles.categories}>
                    {categories.map((category, index: React.Key) => (
                        <div className={styles.categoryContainer}>
                            <Category key={index} {...category} chooseCategory={() => setSelectedCategory(category)}
                                      isSelected={selectedCategory?.id === category.id}/>
                            <button className={styles.edit} onClick={() => setHandledCategory(category)}></button>
                        </div>
                    ))}
                    <button className={styles.addCategory} onClick={() => setHandledCategory(newCategory)}>
                        <Image src="/images/plus-button.png" alt="" width={42} height={42}/>Add
                    </button>
                </div>
                <div className={styles.cards}>
                    {dreams && dreams.map((card, index: React.Key) => (
                        <BoutiqueCard key={index} card={card} availableToAdd={false}
                                      openModal={() => setSelectedProduct(card)}/>
                    ))}
                    <button className={styles.addCard} onClick={() => setSelectedProduct(newProduct)}>
                        ADD<Image src="/images/plus-button.png" alt="" width={100} height={100}/>
                    </button>
                </div>
                {!isMobile && selectedProduct && (
                    <CreateDream
                        {...selectedProduct}
                        category={selectedCategory}
                        onClose={() => setSelectedProduct(null)}
                        updateList={() => updateDreamList(selectedCategory.id)}
                        deleted={(id) => setDeletedDream(id)}
                    />
                )}
                {!isMobile && handledCategory && (
                    <CreateCategory onClose={() => setHandledCategory(null)} updateList={updateCategoryList}
                                    id={handledCategory.id} name={handledCategory.name}
                                    image={handledCategory.image} deleted={(id) => setDeletedCategory(id)}/>
                )}
                {remove && <ConfirmDelete onClose={() => closeConfirmDelete()}
                                          onDelete={() => deletedDream ? handleDeleteDream(deletedDream) : handleDeleteCategory(deletedCategory)}/>}
            </section>
            <MobileMenu/>
        </div>
    );
};

export default withAuth(Content);
