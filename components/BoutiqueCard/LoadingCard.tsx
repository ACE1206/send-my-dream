import styles from "./BoutiqueCard.module.scss"
import React from "react";
import classNames from 'classnames';

const LoadingCard:React.FC = () => {
    return(
        <>
                <div className={classNames(styles.boutiqueCard, styles.loading)}>
                    <div className={styles.spinner}>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                        <div className={styles.dot}></div>
                    </div>
            <span style={{textAlign: "center"}}>Creating card <br/>Please, wait...</span>
                </div>
        </>
    )
}

export default LoadingCard
