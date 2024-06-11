import styles from '../../styles/CompletedDreams.module.scss'
import React, {useState} from "react";
import Header from "../../components/Header/Header";
import {completedDreams} from "../../data/completed_dreams";
import DreamCard from "../../components/BoutiqueCard/DreamCard";
import {DreamData} from "../../utils/types";
import DreamCardModal from "../../components/BoutiqueCard/DreamCardModal";
import UploadDream from "../../components/Modal/UploadDream";
import MobileMenu from "../../components/Menu/MobileMenu";

const Completed: React.FC = () => {
    const elements = Array.from({length: 64}, () => completedDreams[0]);
    const [selectedProduct, setSelectedProduct] = useState<DreamData | null>(null);
    const [addDream, setAddDream] = useState(false);

    return (
        <div className={styles.dreams}>
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
                    {elements.map((card, index: React.Key) => (
                        <DreamCard key={index} {...card} openModal={() => setSelectedProduct(card)}/>
                    ))}
                    {selectedProduct &&
                        <DreamCardModal cardProps={selectedProduct} onClose={() => setSelectedProduct(null)}/>}
                </div>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default Completed
