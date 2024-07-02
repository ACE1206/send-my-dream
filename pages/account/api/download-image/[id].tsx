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
    const [isMobile, setIsMobile] = useState<boolean>(false);

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
        const isMobileDevice = typeof window !== "undefined" && /Mobi|Android/i.test(window.navigator.userAgent);
        setIsMobile(isMobileDevice);
    }, []);

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
            const canvas = await html2canvas(printRef.current, {
                useCORS: true,
                scale: 2,
            });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${product.name}.png`;
            link.click();
        } catch (error) {
            console.error('Error generating image:', error);
        }
    };

    const share = async () => {
        if (printRef.current === null) {
            console.error('printRef is null');
            return;
        }

        try {
            const canvas = await html2canvas(printRef.current, {
                useCORS: true,
                scale: 2,
            });
            canvas.toBlob(async (blob) => {
                if (blob) {
                    const file = new File([blob], `${product.name}.png`, { type: 'image/png' });
                    if (isMobile && navigator.share) {
                        try {
                            await navigator.share({
                                title: product.name,
                                text: 'Check out this product!',
                                files: [file],
                            });
                        } catch (shareError) {
                            console.error('Error sharing:', shareError);
                        }
                    } else {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(file);
                        link.download = file.name;
                        link.click();
                    }
                }
            }, 'image/png');
        } catch (error) {
            console.error('Error generating image:', error);
        }
    };


    return (
        <div className={styles.download}>
            <Head>
                <title>Download Image</title>
                <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
                <script>eruda.init();</script>
            </Head>
            <Link href={"/"}>
                <Image src={'/images/logo.png'} alt={"Send My Dream"} width={150} height={150}  />
            </Link>
            <div className={styles.modal}>
                {loaded && product && user ? (
                    <>
                        <div ref={printRef} className={styles.downloadImage}>
                            <Image src={product.image} alt={product.name} width={2000} height={2000}  />
                            <div className={styles.card}>
                                <Image src={user.avatar || "/images/account/profile-icon.png"} alt={user.username} width={120} height={120} />
                                <h2>{user.username}</h2>
                            </div>
                        </div>
                        {isMobile && (
                            <button className={styles.share} onClick={share}>Share</button>
                        )}
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default DownloadImage;
