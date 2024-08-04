import styles from "./Cards.module.scss"
import React from "react";
import Image from "next/image";
import {CardProps} from "../../utils/types";
import Link from "next/link";
import {useRouter} from "next/router";
// <Image src="/images/ai-card.svg" alt="ai" width={40} height={40}/>

// <Image src="/images/boutique-card.svg" alt="boutique" width={40} height={40}/>

const BoutiqueCard: React.FC = () => {
    const router = useRouter();

    return (
        <div className={styles.cards}>
            <div className={styles.title}>
                <h1>Create dreams!</h1>
                <p>Choose how to create your dreams</p>
            </div>
            <div>
                <Link href="/create" className={router.pathname === "/create" ? styles.active : ''}>
                        <h3>AI</h3>
                </Link>
                <Link href="/boutique" className={router.pathname === "/boutique" ? styles.active : ''}>
                        <h3>Boutique</h3>
                </Link>
            </div>
        </div>
    )
};

export default BoutiqueCard;
