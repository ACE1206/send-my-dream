// pages/account/choose.tsx
import React, { useState } from 'react';
import styles from '../../styles/Choose.module.scss';
import Header from '../../components/Header/Header';
import { backgrounds } from '../../data/backgrounds';
import Image from 'next/image';
import { useRouter } from 'next/router';
import withAuth from '../../components/HOC/withAuth';
import Link from 'next/link';
import { sendProducts } from '../../utils/api';
import SuccessAnimation from '../../components/Background/SuccessAnimation';

const Choose: React.FC = () => {
    const defaultBackground = typeof window !== 'undefined' ? window.localStorage.getItem('bg-image') : '/images/earth-background.png';
    const [backgroundImage, setBackgroundImage] = useState(defaultBackground || '/images/earth-background.png');
    const [showAnimation, setShowAnimation] = useState(false);
    const router = useRouter();
    const { product } = router.query;

    const handleBack = () => {
        router.back();
    };

    const confirmSend = async () => {
        setShowAnimation(true);
        await sendProducts([product]);
        setTimeout(() => {
            router.push({
                pathname: '/account/success',
                query: {product: product},
            })
        }, 3000);
    };

    return (
        <div className={styles.choose} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Header />
            {showAnimation ? (
                <SuccessAnimation backgroundImage={backgroundImage} />
            ) : (
                <section>
                    <h1>Choose an object</h1>
                    <div className={styles.objects}>
                        {backgrounds.map((background, index) => (
                            <button key={index} onClick={() => setBackgroundImage(background.animation)}>
                                <Image src={background.preview} alt={background.alt} width={300} height={300} />
                            </button>
                        ))}
                    </div>
                    <div className={styles.buttons}>
                        <Link href={"/account/"} className={styles.cancel}>Cancel</Link>
                        <button onClick={confirmSend} className={styles.confirm} type="button">Confirm</button>
                    </div>
                </section>
            )}
        </div>
    );
};

export default withAuth(Choose);
