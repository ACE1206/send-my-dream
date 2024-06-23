import React, {useEffect, useState} from "react";
import styles from "./Background.module.scss";
import LazyLoad from "react-lazyload";

const Background: React.FC = () => {
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

    return (
        <div className={styles.videoBackground}>
            <LazyLoad>
                <video
                    autoPlay
                    loop
                    muted
                    className={styles.animationVideo}
                >
                    <source src={isMobile ? "/images/mobile-background.mp4" : "/images/background.mov"}
                            type="video/webm"/>
                    Your browser does not support the video tag.
                </video>
            </LazyLoad>
        </div>
    );
};

export default Background;
