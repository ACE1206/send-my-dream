import styles from "../../styles/Motivation.module.scss"
import React, {useEffect, useState} from "react";
import Header from "../../components/Header/Header";
import MotivationCards from "../../components/Cards/MotivationCards";
import QuotesSlider from "../../components/Slider/QuotesSlider";
import MotivationCarousel from "../../components/Slider/MotivationCarousel";
import MobileMenu from "../../components/Menu/MobileMenu";
import Head from "next/head";
import {getQuotes, getUserData} from "../../utils/api";
import {CardData} from "../../utils/types";
import UploadQuote from "../../components/Modal/UploadQuote";

const Motivation: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [addQuote, setAddQuote] = useState(null);
    const [quotes, setQuotes] = useState([])
    const [loaded, setLoaded] = useState(false)

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
        updateUser().then(updateQuotes).then(() => setLoaded(true));
    }, []);

    const updateQuotes = async () => {
        const response = await getQuotes()
        setQuotes(response)
    }

    const newQuote = {
        author: null,
        text: null,
    };

    return (
        <div className={styles.motivation}>
            <Head>
                <title>Motivation</title>
            </Head>
            <Header/>
            <section className={styles.container}>
                <MotivationCards/>
                <QuotesSlider quotes={quotes} editable={isAdmin} onSave={() => {
                    setAddQuote(null)
                    updateQuotes()
                }}/>
                {loaded &&
                    <MotivationCarousel quotes={quotes}/>
                }
                {isAdmin &&
                    <button onClick={() => setAddQuote(newQuote)} className={`${styles.addQuote} hide-on-mobile`}>Add quote</button>}
            </section>
            {addQuote && <UploadQuote {...addQuote} onClose={() => setAddQuote(null)} onSave={() => {
                setAddQuote(null)
                updateQuotes()
            }}/>}
            <MobileMenu/>
        </div>
    )
}

export default Motivation
