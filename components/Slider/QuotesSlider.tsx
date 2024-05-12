import styles from "./QuotesSlider.module.scss"
import React, {useState} from "react";
import {quotes} from "../../data/quotes";

const QuotesSlider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextQuote = () => {
        setCurrentIndex((currentIndex + 1) % quotes.length);
    };

    const prevQuote = () => {
        setCurrentIndex((currentIndex - 1 + quotes.length) % quotes.length);
    };

    return (
        <div className={`${styles.slider} hide-on-mobile`}>
            <button className={styles.arrow} onClick={prevQuote}></button>
            <div className={styles.quoteContainer}>
                <p className={styles.author}>{quotes[currentIndex].author}</p>
                <p className={styles.quote}>{quotes[currentIndex].text}</p>
            </div>
            <button className={styles.arrow} onClick={nextQuote}></button>
        </div>
    );
};

export default QuotesSlider;
