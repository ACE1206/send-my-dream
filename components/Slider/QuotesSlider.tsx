import styles from "./QuotesSlider.module.scss"
import React, {useEffect, useState} from "react";
import UploadQuote from "../Modal/UploadQuote";
import {deleteQuotes} from "../../utils/api";
import ConfirmDelete from "../Modal/ConfirmDelete";

const QuotesSlider: React.FC<{ quotes: any, editable?: boolean, onSave?: () => void }> = ({quotes, editable = false, onSave}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [edit, setEdit] = useState(false);
    const [remove, setRemove] = useState(null);

    const nextQuote = () => {
        setCurrentIndex((currentIndex + 1) % quotes.length);
    };

    const prevQuote = () => {
        setCurrentIndex((currentIndex - 1 + quotes.length) % quotes.length);
    };

    const deleteQuote = async (id: number) => {
        await deleteQuotes(id)
        setEdit(false)
        setRemove(null)
        onSave()
    }

    return (
        <div className={`${styles.slider} hide-on-mobile`}>
            {quotes && quotes.length > 0 &&
                <>
                    {quotes.length > 1 && <button className={styles.arrow} onClick={prevQuote}></button>}
                    <div className={styles.quoteContainer}>
                        <p className={styles.author}>{quotes[currentIndex].author}</p>
                        <p className={styles.quote}>{quotes[currentIndex].text}</p>
                    </div>
                    {quotes.length > 1 && <button className={styles.arrow} onClick={nextQuote}></button>}
                    {editable && <button onClick={() => setEdit(true)} className={`${styles.edit} hide-on-mobile`}></button>}
                    {edit && <UploadQuote {...quotes[currentIndex]} onClose={() => setEdit(false)}
                                          onDelete={(id) => setRemove(id)} onSave={() => {
                        setEdit(false)
                        onSave()
                    }
                    }/>}
                    {remove && <ConfirmDelete onClose={() => setRemove(null)} onDelete={() => deleteQuote(remove)}/>}
                </>
            }
        </div>
    );
};

export default QuotesSlider;
