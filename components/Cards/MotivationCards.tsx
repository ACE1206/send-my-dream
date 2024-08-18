// Меню мотивации

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
                    <h3>Project <br/> philosophy </h3>
                </Link>
                <Link href="/meditation" className={router.pathname === "/meditation" ? styles.active : ''}>
                    <h3>Meditation <br/> collection</h3>
                </Link>
            </div>
        </div>
    )
}

export default MotivationCards
