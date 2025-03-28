// Фон на главном экране

import React, {useEffect, useState} from "react";
import styles from "./Background.module.scss";
import Image from "next/image";
import LazyLoad from "react-lazyload";

const Background: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [loaded, setLoaded] = useState(false)

    // Проверка разрешения экрана
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");

        const handleMediaQueryChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        setIsMobile(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        setLoaded(true)

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, []);

    // Обработчик загрузки видео
    const handleLoadedData = () => {
        setVideoLoaded(true);
        const videoElement = document.querySelector(`.${styles.animationVideo}`) as HTMLVideoElement;
        if (videoElement) {
            videoElement.style.opacity = "1";
        }
    };

    // Если автоматически не воспроизводится - добавлен обработчик взаимодействия пользователя с интерфейсом
    useEffect(() => {
        const videoElement = document.querySelector(`.${styles.animationVideo}`) as HTMLVideoElement;

        const handleInteraction = () => {
            if (videoElement && (videoElement.paused || videoElement.ended)) {
                videoElement.play().catch((error) => {
                    console.error("Error attempting to play video:", error);
                });
            }
        };

        document.body.addEventListener('click', handleInteraction);
        document.body.addEventListener('touchstart', handleInteraction);

        return () => {
            document.body.removeEventListener('click', handleInteraction);
            document.body.removeEventListener('touchstart', handleInteraction);
        };
    }, []);

    return (
        <div className={styles.videoBackground}>
            {loaded &&
                <>
                    {/*{!videoLoaded && (*/}
                    {/*    <Image*/}
                    {/*        src={isMobile ? '/images/mobile-background.webp' : '/images/background.webp'}*/}
                    {/*        alt="Background"*/}
                    {/*        className={styles.backgroundImage}*/}
                    {/*        width={2000}*/}
                    {/*        height={2000}*/}
                    {/*    />*/}
                    {/*)}*/}
                    <LazyLoad>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className={styles.animationVideo}
                            onLoadedData={handleLoadedData}
                            key={isMobile ? "mobile" : "desktop"}
                        >
                            <source
                                src={isMobile ? `/images/background/mobile-background.mp4` : `/images/background/background.mp4`}
                                type="video/mp4"
                            />
                            Your browser does not support the video tag.
                        </video>
                    </LazyLoad>
                </>
            }
        </div>
    );
};

export default Background;
