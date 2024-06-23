import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import html2canvas from 'html2canvas-objectfit-fix';
import { getBasketByProductId } from "../../../../utils/api";
import styles from '../../../../styles/Download.module.scss';
import Image from "next/image";
import Link from "next/link";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;
    return {
        props: {
            id,
        }
    };
};

const DownloadImage: React.FC<{ id: string }> = ({ id }) => {
    const router = useRouter();
    const printRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState(null);
    const [product, setProduct] = useState(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        const getData = async () => {
            console.log(id);
            const data = await getBasketByProductId(id);
            setUser(data.user);
            setProduct(data.product);
            setLoaded(true);
        };

        getData();
    }, [id]);

    useEffect(() => {
        if (loaded && printRef.current !== null) {
            handleDownloadImage();
        }
    }, [loaded]);

    const handleDownloadImage = async () => {
        if (printRef.current === null) return;
        const canvas = await html2canvas(printRef.current);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'screenshot.png';
        link.click();
    };

    return (
        <div className={styles.download}>
            <Link href={"/"}><Image src={'/images/logo.png'} alt={"Send My Dream"} width={150} height={150} /></Link>
            <div className={styles.modal}>
                {loaded &&
                    <div ref={printRef} className={styles.downloadImage}>
                        <Image src={product.image} alt={product.name} width={2000} height={2000} />
                        <div className={styles.card}>
                            <Image src={user.avatar} alt={user.username} width={120} height={120} />
                            <h2>{user.username}</h2>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default DownloadImage;
