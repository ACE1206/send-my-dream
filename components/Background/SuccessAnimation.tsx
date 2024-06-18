import React from 'react';
import styles from './SuccessAnimation.module.scss';

interface SuccessAnimationProps {
    backgroundVideo: string;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ backgroundVideo }) => {
    return (
        <div className={styles.animationContainer} style={{ backgroundImage: `url(${backgroundVideo})` }}>
            <video autoPlay muted className={styles.animationVideo}>
                <source src="/images/ring.mov" type="video/webm" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default SuccessAnimation;
