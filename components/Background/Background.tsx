import React, { useEffect, useState } from "react";
import styles from "./Background.module.scss";

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
            <video autoPlay loop muted>
                <source src={isMobile ? "/images/mobile-background.mp4" : "/images/background.mp4"} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default Background;
