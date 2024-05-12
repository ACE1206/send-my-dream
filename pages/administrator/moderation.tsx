import styles from '../../styles/Moderation.module.scss'
import React, {useState} from "react";
import Header from "../../components/Header/Header";
import AdministratorMenu from "../../components/Menu/AdministratorMenu";
import {content} from "../../data/admin_menu";
import {completedDreams} from "../../data/completed_dreams";
import {DreamData} from "../../utils/types";
import Image from "next/image";
import DreamCardModal from "../../components/BoutiqueCard/DreamCardModal";
import MobileMenu from "../../components/Menu/MobileMenu";

const Moderation: React.FC = () => {
    const elements = Array.from({length: 5}, () => completedDreams[0]);
    const [selectedProduct, setSelectedProduct] = useState<DreamData | null>(null);

    return (
        <div className={styles.moderation}>
            <Header/>
            <section>
                <h1>Administrator Settings</h1>
                <AdministratorMenu {...content} />
                <div className={styles.dreams}>
                    {elements.map((el, index: React.Key) => (
                        <div className={styles.dream} onClick={() => setSelectedProduct(el)}>
                            <Image src={el.img} alt="" width={220} height={220}/>
                            <div className={styles.info}>
                                <div className={styles.author}>
                                    <Image src={el.avatar} alt="" width={60} height={60}/>
                                    <span>{el.author}</span>
                                </div>
                                <h5>{el.text}</h5>
                                <p>{el.description}</p>
                            </div>
                            <div className={styles.buttons}>
                                <button onClick={e => e.stopPropagation()}></button>
                                <button onClick={e => e.stopPropagation()}></button>
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

export default Moderation
