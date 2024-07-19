import React, {useEffect, useState} from 'react';
import styles from './SuccessAnimation.module.scss';
import LazyLoad from "react-lazyload";

interface SuccessAnimationProps {
    background: any;
    onVideoDuration: (duration: number) => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({background, onVideoDuration}) => {
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

    const handleLoadedMetadata = (event: React.SyntheticEvent<HTMLVideoElement>) => {
        const videoElement = event.currentTarget;
        onVideoDuration(videoElement.duration * 1000);
        const audio = new Audio('/sound/ring.mp3');

        const playSound = () => {
            audio.play().catch((error) => {
                console.error('Failed to play sound:', error);
            });
        };

        const timer = setTimeout(playSound, 5500);

        return () => clearTimeout(timer);
    };


    return (
        <>
            {background &&
                <div className={styles.animationContainer}
                     style={{backgroundImage: `url(${background.backgroundImage})`}}>
                    <LazyLoad>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className={styles.animationVideo}
                            key={background.success}
                            onLoadedMetadata={handleLoadedMetadata}
                        >
                            <source src={isMobile ? background.successMobile : background.success} type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                    </LazyLoad>
                </div>
            }
        </>
    );
};

export default SuccessAnimation;
