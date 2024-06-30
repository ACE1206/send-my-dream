import { GetServerSideProps } from 'next';
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import html2canvas from 'html2canvas-objectfit-fix';
import { getBasketByProductId } from "../../../../utils/api";
import styles from '../../../../styles/Download.module.scss';
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

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
    const [user, setUser] = useState<any>(null);
    const [product, setProduct] = useState<any>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [imagesLoaded, setImagesLoaded] = useState<number>(0);

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await getBasketByProductId(id);
                setUser(data.user);
                setProduct(data.product);
                setLoaded(true);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getData();
    }, [id]);

    useEffect(() => {
        if (loaded) {
            handleDownloadImage();
        }
    }, [loaded]);

    const handleDownloadImage = async () => {
        if (printRef.current === null) {
            console.error('printRef is null');
            return;
        }

        try {
            const canvas = await html2canvas(printRef.current);
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${product.name}.png`;
            link.click();
        } catch (error) {
            console.error('Error generating image:', error);
        }
    };

    const handleImageLoad = () => {
        setImagesLoaded(prev => prev + 1);
    };

    return (
        <div className={styles.download}>
            <Head>
                <title>Download Image</title>
            </Head>
            <Link href={"/"}>
                <Image src={'/images/logo.png'} alt={"Send My Dream"} width={150} height={150} onLoad={handleImageLoad} />
            </Link>
            <div className={styles.modal}>
                {loaded && product && user ? (
                    <div ref={printRef} className={styles.downloadImage}>
                        <Image src={product.image} alt={product.name} width={2000} height={2000} onLoad={handleImageLoad} />
                        <div className={styles.card}>
                            <Image src={user.avatar || "/images/account/profile-icon.png"} alt={user.username} width={120} height={120} onLoad={handleImageLoad} />
                            <h2>{user.username}</h2>
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default DownloadImage;
