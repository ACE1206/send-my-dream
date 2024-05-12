import styles from "./Cards.module.scss"
import React from "react";
import Link from "next/link";
import Image from "next/image";

const MotivationCards: React.FC = () => {
    return (
        <div className={styles.cards}>
            <div className={styles.title}>
                <div>
                    <Image src="/motivation/react.svg" alt="" width={70} height={70}/>
                    <h1>Create dreams!</h1>
                </div>
            </div>
            <div>
                <Link href="/motivation">
                    <Image src="/motivation/philosofy.png" alt="ai" width={40} height={40}/>
                    <div>
                        <h3>Project philosophy </h3>
                        <p>We become the embodiment of our mind</p>
                    </div>
                </Link>
                <Link href="/meditation">
                    <Image src="/motivation/meditation.png" alt="boutique" width={40} height={40}/>
                    <div>
                        <h3>Meditation</h3>
                        <p>Collection of audio meditations</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default MotivationCards
