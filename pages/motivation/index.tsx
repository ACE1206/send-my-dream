import styles from "../../styles/Motivation.module.scss"
import React from "react";
import Header from "../../components/Header/Header";
import MotivationCards from "../../components/Cards/MotivationCards";
import QuotesSlider from "../../components/Slider/QuotesSlider";
import MotivationCarousel from "../../components/Slider/MotivationCarousel";
import {quotes} from "../../data/quotes";
import MobileMenu from "../../components/Menu/MobileMenu";

const Motivation:React.FC = () => {
    return (
        <div className={styles.motivation}>
            <Header/>
            <section className={styles.container}>
                <MotivationCards/>
                <QuotesSlider/>
                <MotivationCarousel quotes={quotes}/>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default Motivation
