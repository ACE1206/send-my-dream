import React, {useEffect, useState} from "react";
import styles from "./Background.module.scss";
import Image from "next/image";

const Background: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [loaded, setLoaded] = useState(false)

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

    const handleLoadedData = () => {
        setVideoLoaded(true);
        const videoElement = document.querySelector(`.${styles.animationVideo}`) as HTMLVideoElement;
        if (videoElement) {
            videoElement.style.opacity = "1";
        }
    };

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
                    {!videoLoaded && (
                        <Image
                            src={isMobile ? '/images/mobile-background.webp' : '/images/background.webp'}
                            alt="Background"
                            className={styles.backgroundImage}
                            width={2000}
                            height={2000}
                        />
                    )}
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
                            src={isMobile ? `${GLOBAL_URL}/img/backgrounds/main/mobile-background.mp4` : `${GLOBAL_URL}/img/backgrounds/main/background.mp4`}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                </>
            }
        </div>
    );
};

export default Background;
