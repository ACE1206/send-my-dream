import styles from "../styles/Main.module.scss";
import Header from "../components/Header/Header";
import React, {useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import Background from "../components/Background/Background";
import Head from "next/head";
import {useRouter} from "next/router";

const Page: React.FC = () => {
    // const router = useRouter()
    //
    // useEffect(() => {
    //     router.replace('/create')
    // }, [router]);
    //
    // return null;

    return (
        <div className={styles.main}>
            <Head>
                <title>SEND MY DREAM</title>
            </Head>
            <Background/>
            <Header/>
            {/*<Image src="/images/logo.webp" alt="" width={100} height={100} loading={"lazy"}/>*/}
            <h1>SEND MY DREAM</h1>
            <p className={styles.text}>
                If you can dream it - you can create it! <br/> Believe everything is possible!

                {/*If you can dream it - you can create it! <br/> Believe in yourself! <br/> Everything is possible!*/}

                {/*To make dreams come true, you need confidence, perseverance, and hard work.*/}
                {/*You need the ability to see opportunities clearly and use them. <br/> And also luck!*/}
            </p>
            <Link href="/create" className={styles.button}>Create my dreams!</Link>
        </div>
    );
}

export default Page;
