import React, {useState} from 'react';
import styles from "./GenerateLink.module.scss";
import {generateLink} from "../../utils/api";

const GenerateLink: React.FC<{ id: number, onClose: () => void }> = ({id, onClose}) => {
    const [link, setLink] = useState<string | null>(null);

    const handleGenerateLink = async (e) => {
        e.preventDefault()
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

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>Share your Dreams!</h2>
                <p>Share your desires with your loved ones - bring them closer to realization</p>
                <div>
                    <button className={styles.generate} disabled={!!link} style={link ? {opacity: "0.6"} : {}} onClick={handleGenerateLink}>Share your wishes</button>
                    {link && <><a href={link} target="_blank" rel="noopener noreferrer">{link}</a> <button onClick={copyTextToClipboard} className={styles.copy}></button></>}
                </div>
            </div>
        </div>
    );
};

export default GenerateLink;
