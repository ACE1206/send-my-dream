import styles from '../../styles/CompletedDreams.module.scss'
import React, {useEffect, useState} from "react";
import Header from "../../components/Header/Header";
import {completedDreams} from "../../data/completed_dreams";
import DreamCard from "../../components/BoutiqueCard/DreamCard";
import {DreamData} from "../../utils/types";
import DreamCardModal from "../../components/BoutiqueCard/DreamCardModal";
import UploadDream from "../../components/Modal/UploadDream";
import MobileMenu from "../../components/Menu/MobileMenu";
import {getCompletedDreams} from "../../utils/api";
import Head from "next/head";

const Completed: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<DreamData | null>(null);
    const [addDream, setAddDream] = useState(false);
    const [completedDreams, setCompletedDreams] = useState([])

    useEffect(() => {
        updateDreams()
        console.log(completedDreams)
    }, [])

    const updateDreams = async () => {
        const data = await getCompletedDreams("APPROVED");
        setCompletedDreams(data)
    }

    return (
        <div className={styles.dreams}>
            <Head>
                <title>Completed Dreams</title>
            </Head>
            <Header/>
            <section>
                <div className={styles.title}>
                    <div>
                        <h1>THE COMPLETED DREAMS </h1>
                        <span>(posted by our users)</span>
                    </div>
                    <button className={`hide-on-mobile`} onClick={() => setAddDream(true)}>Post</button>
                    {addDream && <UploadDream onClose={() => setAddDream(false)}/>}
                </div>
                <div className={styles.cards}>
                    {completedDreams.map((card, index: React.Key) => (
                        <DreamCard key={index} text={card.name} avatar={card.user.avatar} img={card.image}
                                   author={card.user.username} description={card.description} date={card.createdAt}
                                   openModal={() => setSelectedProduct({
                                       text: card.name,
                                       author: card.user.username,
                                       img: card.image,
                                       avatar: card.user.avatar,
                                       description: card.description,
                                       date: card.createdAt
                                   })}/>
                    ))}
                </div>
                {selectedProduct &&
                    <DreamCardModal cardProps={selectedProduct} onClose={() => setSelectedProduct(null)}/>}
            </section>
            <MobileMenu/>
        </div>
    )
}

export default Completed
