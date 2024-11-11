import styles from '../../styles/CompletedDreams.module.scss'
import React, {useEffect, useState} from "react";
import Header from "../../components/Header/Header";
import DreamCard from "../../components/BoutiqueCard/DreamCard";
import {DreamData} from "../../utils/types";
import DreamCardModal from "../../components/BoutiqueCard/DreamCardModal";
import UploadDream from "../../components/Modal/UploadDream";
import MobileMenu from "../../components/Menu/MobileMenu";
import {getCompletedDreams, getUserData} from "../../utils/api";
import Head from "next/head";

const Completed: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<DreamData | null>(null);
    const [addDream, setAddDream] = useState(false);
    const [completedDreams, setCompletedDreams] = useState([])
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        const updateUser = async () => {
            if (typeof window !== 'undefined') {
                try {
                    const fetchUser = await getUserData();
                    setIsAdmin(fetchUser.type === "ADMIN")
                } catch (e) {
                    setIsAdmin(false)
                }
            }
        };
        updateUser().then(updateDreams);
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
            <section className={styles.content}>
                <div className={styles.title}>
                    <div>
                        <h1>THE COMPLETED DREAMS </h1>
                        <span>(posted by our users)</span>
                    </div>
                    <button className={`hide-on-mobile`} onClick={() => setAddDream(true)}>Post</button>
                    <button className={`hide-on-desktop ${styles.mobileAdd}`} onClick={() => setAddDream(true)}>+
                    </button>
                </div>
                <div className={styles.cards}>
                    {completedDreams.map((card, index: React.Key) => (
                        <DreamCard onSave={updateDreams} id={card.id} editable={isAdmin === true} key={index} text={card.name}
                                   avatar={card.user.avatar} img={card.image}
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
            {addDream && <UploadDream onClose={() => setAddDream(false)}/>}
        </div>
    )
}

export default Completed
