import React from 'react';
import styles from './SuccessAnimation.module.scss';

interface SuccessAnimationProps {
    backgroundImage: string;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ backgroundImage }) => {
    return (
        <div className={styles.animationContainer} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <video autoPlay muted className={styles.animationVideo}>
                <source src="/images/ZODIAC.mov" type="video/webm" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default SuccessAnimation;
