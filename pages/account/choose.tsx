import React, {useState} from "react";
import styles from '../../styles/Choose.module.scss'
import Header from "../../components/Header/Header";
import {backgrounds} from "../../data/backgrounds";
import Image from "next/image";
import {useRouter} from "next/router";

const Choose:React.FC = () => {
    const defaultBackground =  typeof window !== "undefined" ? window.localStorage.getItem('bg-image') : '/earth-background.gif'
    const [backgroundImage, setBackgroundImage] = useState(defaultBackground);
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <div className={styles.choose}>
            <Header />
            <section>
                <h1>Choose an object</h1>
                <div className={styles.objects}>
                    {backgrounds.map((background, index) => (
                        <button key={index} onClick={() => setBackgroundImage(background.animation)}><Image src={background.preview} alt={background.alt} width={300} height={300}/></button>
                    ))}
                </div>
                <div className={styles.buttons}>
                    <button className={styles.cancel} type="button" onClick={handleBack}>Cancel</button>
                    <button className={styles.confirm} type="button">Confirm</button>
                </div>
            </section>
        </div>
    )
}

export default Choose
