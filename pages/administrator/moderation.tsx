import styles from '../../styles/Moderation.module.scss'
import React, {useEffect, useState} from "react";
import Header from "../../components/Header/Header";
import AdministratorMenu from "../../components/Menu/AdministratorMenu";
import {content} from "../../data/admin_menu";
import {completedDreams} from "../../data/completed_dreams";
import {DreamData} from "../../utils/types";
import Image from "next/image";
import DreamCardModal from "../../components/BoutiqueCard/DreamCardModal";
import MobileMenu from "../../components/Menu/MobileMenu";
import withAuth from "../../components/HOC/withAuth";
import {getCompletedDreams, setCompletedDreamStatus} from "../../utils/api";
import Head from "next/head";

const Moderation: React.FC = () => {
    const [completedDreams, setCompletedDreams] = useState([])
    const [selectedProduct, setSelectedProduct] = useState<DreamData | null>(null);

    useEffect(() => {
        updateDreams()
    }, [])

    const updateDreams = async () => {
        const data = await getCompletedDreams("ADDED");
        setCompletedDreams(data)
    }

    const changeDreamStatus = async (e, id, status) => {
        e.stopPropagation();
        const formData = new FormData();
        formData.append("status", status)
        await setCompletedDreamStatus(id, formData)
        updateDreams()
    }

    return (
        <div className={styles.moderation}>
            <Head>
                <title>Moderation</title>
            </Head>
            <Header/>
            <section>
                <h1>Administrator Settings</h1>
                <AdministratorMenu {...content} />
                <div className={styles.dreams}>
                    {completedDreams.map((el, index: React.Key) => (
                        <div key={index} className={styles.dream} onClick={() => setSelectedProduct({
                            text: el.name,
                            author: el.user.username,
                            img: el.image,
                            avatar: el.user.avatar,
                            description: el.description,
                            date: el.createdAt
                        })}>
                            <Image src={el.image} alt="" width={220} height={220}/>
                            <div className={styles.info}>
                                <div className={styles.author}>
                                    <Image src={el.user.avatar} alt="" width={60} height={60}/>
                                    <span>{el.user.username}</span>
                                </div>
                                <h5>{el.name}</h5>
                                <p>{el.description}</p>
                            </div>
                            <div className={styles.buttons}>
                                <button onClick={(e) => changeDreamStatus(e, el.id, "APPROVED")}></button>
                                <button onClick={(e) => changeDreamStatus(e, el.id, "DECLINED")}></button>
                            </div>
                        </div>
                    ))}
                </div>
                {selectedProduct &&
                    <DreamCardModal cardProps={selectedProduct} onClose={() => setSelectedProduct(null)}/>}
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Moderation)
