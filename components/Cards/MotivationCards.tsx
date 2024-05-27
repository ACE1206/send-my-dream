import styles from "./Cards.module.scss"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/router";

const MotivationCards: React.FC = () => {
    const router = useRouter();

    return (
        <div className={styles.cards}>
            <div className={styles.title}>
                <div>
                    <Image src="/images/motivation/react.svg" alt="" width={70} height={70}/>
                    <h1>Create dreams!</h1>
                </div>
            </div>
            <div>
                <Link href="/motivation" className={router.pathname === "/motivation" ? styles.active : ''}>
                    <Image src="/images/motivation/philosofy.png" alt="ai" width={40} height={40}/>
                    <div>
                        <h3>Project philosophy </h3>
                        <p>We become the embodiment of our mind</p>
                    </div>
                </Link>
                <Link href="/meditation" className={router.pathname === "/meditation" ? styles.active : ''}>
                    <Image src="/images/motivation/meditation.png" alt="boutique" width={40} height={40}/>
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
