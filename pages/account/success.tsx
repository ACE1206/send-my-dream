import React, {useEffect, useState} from 'react';
import styles from '../../styles/Success.module.scss';
import Header from '../../components/Header/Header';
import {useRouter} from 'next/router';
import withAuth from '../../components/HOC/withAuth';
import ProfileCard from '../../components/BoutiqueCard/ProfileCard';
import {CardData} from '../../utils/types';
import {getProductsByIds} from "../../utils/api";
import Image from "next/image";
import Head from "next/head";

const Success: React.FC = () => {
    const router = useRouter();
    const [sentProducts, setSentProducts] = useState<CardData[]>([]);
    const {product, background} = router.query;

    useEffect(() => {
        if (product) {
            fetchSentProducts(product);
        }
        setTimeout(() => {
            router.push({
                pathname: '/account',
            })
        }, 5000);
    }, [router.query]);

    const fetchSentProducts = async (productIds) => {
        try {
            const data = await getProductsByIds([productIds])
            setSentProducts(data);
        } catch (error) {
            console.error('Failed to fetch sent products:', error);
        }
    };

    const splitImages = (images: CardData[]) => {
        const leftImages: CardData[][] = [];
        const rightImages: CardData[][] = [];
        for (let i = 0; i < images.length; i += 4) {
            leftImages.push(images.slice(i, i + 2));
            rightImages.push(images.slice(i + 2, i + 4));
        }
        return {leftImages, rightImages};
    };

    const {leftImages, rightImages} = splitImages(sentProducts);

    return (
        <div className={styles.success} style={{backgroundImage: `url(${background})`}}>
            <Head>
                <title>Congratulations</title>
            </Head>
            <section>
                <div className={styles.leftColumn}>
                    {leftImages.map((row, rowIndex) => (
                        <div key={rowIndex} className={styles.imageRow}>
                            {row.map((product) => (
                                <img key={product.id} src={product.image} alt="Product" className={styles.image}/>
                            ))}
                        </div>
                    ))}
                </div>
                <div className={styles.successText}>
                    <h1>Done!</h1>
                    <Image src={"/images/done.png"} alt={"Done"} width={1000} height={1000}/>
                    <h2>Now you know exactly what your dreams are</h2>
                    <div>
                        <span>Live</span>
                        <span>Dream</span>
                        <span>Create</span>
                    </div>
                </div>
                <div className={styles.rightColumn}>
                    {rightImages.map((row, rowIndex) => (
                        <div key={rowIndex} className={styles.imageRow}>
                            {row.map((product) => (
                                <img key={product.id} src={product.image} alt="Product" className={styles.image}/>
                            ))}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default withAuth(Success);
