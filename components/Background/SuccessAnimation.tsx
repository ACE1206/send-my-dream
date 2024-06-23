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
            console.log("Media query matched:", event.matches);
        };

        setIsMobile(mediaQuery.matches);
        console.log("Initial media query matched:", mediaQuery.matches);

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, []);
    const handleLoadedMetadata = (event: React.SyntheticEvent<HTMLVideoElement>) => {
        const videoElement = event.currentTarget;
        onVideoDuration(videoElement.duration * 1000); // Convert seconds to milliseconds
    };


    return (
        <>
            {background &&
                <div className={styles.animationContainer}
                     style={{backgroundImage: `url(${background.backgroundImage})`}}>
                    <LazyLoad>
                        <video
                            autoPlay
                            muted
                            className={styles.animationVideo}
                            key={background.success}
                            onLoadedMetadata={handleLoadedMetadata}
                        >
                            <source src={isMobile ? background.successMobile : background.success} type="video/webm"/>
                            Your browser does not support the video tag.
                        </video>
                    </LazyLoad>
                </div>
            }
        </>
    );
};

export default SuccessAnimation;
