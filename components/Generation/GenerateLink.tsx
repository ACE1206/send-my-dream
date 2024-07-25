import React, {useEffect, useState} from 'react';
import styles from "./GenerateLink.module.scss";
import {generateLink} from "../../utils/api";
import {useRouter} from "next/router";

const GenerateLink: React.FC<{ id: number, onClose: () => void }> = ({id, onClose}) => {
    const [link, setLink] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    useEffect(() => {
        const isMobileDevice = typeof window !== "undefined" && /Mobi|Android/i.test(window.navigator.userAgent);
        setIsMobile(isMobileDevice);
        setLoading(false)
    }, []);

    const handleGenerateLink = async () => {
        const response = await generateLink(id)
        setLink(`${window.location.origin}/account/api/download-image/${response.uniqueId}`);
    };

    const copyTextToClipboard = async () => {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(link);
        } else {
            return document.execCommand('copy', true, link);
        }
    }

    const redirectToShare = async () => {
        const response = await generateLink(id)
        router.push(`${window.location.origin}/account/api/download-image/${response.uniqueId}`);
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {loading ? (
                    <h2>Loading...</h2>
                ) : (
                    <>
                        <h2>Share your Dreams!</h2>
                        <p>Share your desires with your loved ones - bring them closer to realization</p>
                        <div>
                            {isMobile ? (
                                <button className={styles.generate} onClick={redirectToShare}>Share your wishes
                                </button>
                            ) : (
                                <>
                                    <button className={styles.generate} disabled={!!link}
                                            style={link ? {opacity: "0.6"} : {}}
                                            onClick={handleGenerateLink}>Share your wishes
                                    </button>
                                    {link && <><a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                                        <button onClick={copyTextToClipboard} className={styles.copy}></button>
                                    </>}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GenerateLink;
