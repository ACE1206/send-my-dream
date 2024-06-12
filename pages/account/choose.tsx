import React, {useState} from "react";
import styles from '../../styles/Choose.module.scss'
import Header from "../../components/Header/Header";
import {backgrounds} from "../../data/backgrounds";
import Image from "next/image";
import {useRouter} from "next/router";
import withAuth from "../../components/HOC/withAuth";
import Link from "next/link";
import {sendProducts} from "../../utils/api";

const Choose:React.FC = () => {
    const defaultBackground =  typeof window !== "undefined" ? window.localStorage.getItem('bg-image') : '/images/earth-background.mp4'
    const [backgroundImage, setBackgroundImage] = useState(defaultBackground);
    const router = useRouter();
    const { product } = router.query;

    const handleBack = () => {
        router.back();
    };

    const confirmSend = async () => {
        const response =  await sendProducts(product)
    }

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
                    <Link href={"/account/"} className={styles.cancel}>Cancel</Link>
                    <button onClick={confirmSend} className={styles.confirm} type="button">Confirm</button>
                </div>
            </section>
        </div>
    )
}

export default withAuth(Choose)
