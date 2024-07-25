import {GetServerSideProps} from 'next';
import {useRouter} from "next/router";
import React, {useEffect, useRef, useState} from "react";
import html2canvas from 'html2canvas-pro';
import {getBasketById, getUserData} from "../../../../utils/api";
import styles from '../../../../styles/Download.module.scss';
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import QRCode from "qrcode.react";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {id} = context.params!;
    return {
        props: {
            id,
        }
    };
};

const DownloadImage: React.FC<{ id: string }> = ({id}) => {
    const printRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<any>(null);
    const [product, setProduct] = useState<any>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [link, setLink] = useState(GLOBAL_URL);
    const [backUrl, setBackUrl] = useState('/');
    const [imageBlob, setImageBlob] = useState<Blob | null>(null);

    const router = useRouter()

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await getBasketById(id);
                setUser(data.user);
                setLink(`${GLOBAL_URL}/account/register?referral=${data.user.referralLink}`);
                setProduct(data.product);
                setLoaded(true);
                const checkUser = getUserData();
                if (checkUser) {
                    setBackUrl('/account')
                }
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
            // handleDownloadImage();
        }
    }, [loaded]);

    const applyStylesToImages = (element: HTMLElement) => {
        const images = Array.from(element.getElementsByTagName('img')) as HTMLImageElement[];
        for (let img of images) {
            img.style.objectFit = 'cover';
        }
    };

    const handleDownloadImage = async () => {
        if (printRef.current === null) {
            console.error('printRef is null');
            return;
        }
        try {
            applyStylesToImages(printRef.current); // Применяем стили

            const canvas = await html2canvas(printRef.current, {useCORS: true, scale: 2});

            const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
            const response = await fetch(dataUrl);
            const blob = await response.blob();

            if (blob) {
                setImageBlob(blob);
                const linkSource = URL.createObjectURL(blob);
                const downloadLink = document.createElement("a");
                downloadLink.href = linkSource;
                downloadLink.download = `${product.name}.jpeg`;
                downloadLink.click();
            } else {
                console.error('Blob creation failed'); // Лог для ошибки создания Blob
            }
        } catch (error) {
            console.error('Error generating image:', error);
        }
    };

    const share = async () => {
        if (!imageBlob) {
            console.error('Image blob is null');
            return;
        }

        const file = new File([imageBlob], `${product.name}.jpeg`, {type: 'image/jpeg'});

        if (isMobile && navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: link,
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
    };

    if (!loaded) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <div className={styles.download}>
            <Head>
                <title>Download Image</title>
                {/*<script src="https://cdn.jsdelivr.net/npm/eruda"></script>*/}
                {/*<script>eruda.init();</script>*/}
            </Head>
            <section className={styles.buttons}>
                <Link href={backUrl}>Website</Link>
                {isMobile && (
                    <button className={styles.share} onClick={share}>Share</button>
                )}
            </section>
            <div className={styles.modal}>
                <>
                    <div ref={printRef} className={styles.downloadImage}>
                        <Image className={styles.backgroundImage} src="/images/space-background.png" alt={''} width={1000} height={1000}/>
                        <Image className={styles.mainImage} src={product.image} alt={product.name} width={2000} height={2000}/>
                        <div className={styles.top}>
                            <Image src={user.avatar || "/images/account/profile-icon.png"} alt={user.username}
                                   width={120} height={120}/>
                            <Image src={"/images/logo.png"} alt={''} width={120} height={120}/>
                            <QRCode value={link} size={100}/>
                        </div>
                        <div className={styles.card}>
                            <h2>{product.name}</h2>
                            <span>Source: sendmydream.com</span>
                        </div>
                    </div>
                </>
            </div>
        </div>
    );
};

export default DownloadImage;
