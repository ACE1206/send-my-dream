import React, {useEffect, useState} from 'react';
import styles from '../../styles/Choose.module.scss';
import Header from '../../components/Header/Header';
import Image from 'next/image';
import {useRouter} from 'next/router';
import withAuth from '../../components/HOC/withAuth';
import Link from 'next/link';
import {getBackgrounds, sendProducts} from '../../utils/api';
import SuccessAnimation from '../../components/Background/SuccessAnimation';
import LazyLoad from 'react-lazyload';
import classNames from 'classnames';
import Head from "next/head";
import {useSocket} from "../../components/Socket/SocketProvider";

const Choose: React.FC = () => {
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [backgrounds, setBackgrounds] = useState([]);
    const [showAnimation, setShowAnimation] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mainBackground, setMainBackground] = useState("");
    const router = useRouter();
    const {product} = router.query;
    const {isPlaying, setIsPlaying} = useSocket();
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");

        const handleMediaQueryChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        setIsMobile(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, []);

    useEffect(() => {
        const updateBackgroundList = async () => {
            try {
                const data = await getBackgrounds();
                setBackgrounds(data);
                if (data.length > 0) {
                    setBackgroundImage(data[0]);
                } else {
                    setBackgroundImage({imageLink: 'unset', videoLink: null});
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        updateBackgroundList();
    }, []);

    const handleBackgroundChange = (background: any) => {
        setIsTransitioning(true);
        setMainBackground("unset");
        if (background.imageLink) {
            const img = document.createElement('img') as HTMLImageElement;
            img.src = background.imageLink;

            img.onload = () => {
                setBackgroundImage(background);
                if (!background.videoLink) {
                    setMainBackground(`url('${isMobile && background.imageLinkMobile ? background.imageLinkMobile : background.imageLink}')`);
                }
            };

            img.onerror = () => {
                console.error('Failed to load image');
            };
        } else {
            setBackgroundImage(background);
        }
    };

    const confirmSend = async () => {
        if (isPlaying) {
            setIsPlaying(false)
        }
        setShowAnimation(true);
        setTimeout(async () => {
            const productsToSend = Array.isArray(product) ? product : [product];
            await sendProducts(productsToSend);
        }, 0);
    };

    const handleVideoDuration = (duration: number) => {
        setTimeout(() => {
            router.push({
                pathname: '/account/success',
                query: {
                    product: product,
                    background: backgroundImage.imageLink
                },
            });
        }, duration);
    };

    return (
        <div className={classNames(styles.choose, {[styles.transitioning]: isTransitioning})}
             style={{backgroundImage: mainBackground}}
        >
            <Head>
                <title>Choose Background</title>
            </Head>
            {/*<Header/>*/}
            <div className={classNames(styles.backgroundContainer, {[styles.transitioning]: isTransitioning})}>
                {backgroundImage?.videoLink ? (
                    <LazyLoad>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className={classNames(styles.backgroundVideo, {[styles.transitioning]: isTransitioning})}
                            key={isMobile ? backgroundImage.videoLinkMobile : backgroundImage.videoLink}
                            onLoadedData={() => setIsTransitioning(false)}
                        >
                            <source src={isMobile ? backgroundImage.videoLinkMobile : backgroundImage.videoLink} type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                    </LazyLoad>
                ) : (
                    <div
                        className={styles.backgroundImage}
                        style={{backgroundImage: `url('${isMobile ? backgroundImage?.imageLinkMobile : backgroundImage?.imageLink}')`}}
                    />
                )}
            </div>
            {showAnimation ? (
                <SuccessAnimation background={backgroundImage} onVideoDuration={handleVideoDuration}/>
            ) : (
                <section>
                    <h1>Choose an object</h1>
                    <div className={styles.objects}>
                        {backgrounds.map((background, index) => (
                            <button className={background === backgroundImage && styles.selected} key={index} onClick={() => handleBackgroundChange(background)}>
                                <Image src={background.imageLink} alt={background.name} width={300} height={300}/>
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
