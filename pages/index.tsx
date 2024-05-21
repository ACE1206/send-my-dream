import styles from "../styles/Main.module.scss";
import Header from "../components/Header/Header";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Background from "../components/Background/Background";

const Page: React.FC = () => {
    return (
        <div className={styles.main}>
            <Background/>
            <Header/>
            <Image src="/logo.png" alt="" width={100} height={100}/>
            <h1>Send my dream</h1>
            <p className={styles.text}>
                To make dreams come true, you need confidence, perseverance, and hard work.
                You need the ability to see opportunities clearly and use them. And also luck!
            </p>
            <Link href="/boutique" className={styles.button}>Create my dream!</Link>
        </div>
    );
}

export default Page;
