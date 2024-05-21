import React from "react";
import styles from "./Background.module.scss";
import useLocalStorage from "./LocalStorageHook";

const Background: React.FC = () => {
    const [value, setValue] = useLocalStorage('/background.mp4');

    return (
        <div className={styles.videoBackground}>
            <video autoPlay loop muted>
                <source src={value} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default Background;
