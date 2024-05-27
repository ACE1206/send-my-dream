import styles from "./UploadDream.module.scss"
import React, {useEffect} from "react";
import {DreamData, ModalProps} from "../../utils/types";
import ImageUpload from "../input/ImageUpload";
import Link from "next/link";
import Image from "next/image";
const Modal: React.FC<ModalProps> = ({onClose}) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <form>
                    <input className={styles.heading} type="text" placeholder="Heading"/>
                    <label className={styles.description}>Description
                        <textarea placeholder="Write here"/>
                    </label>
                    <ImageUpload/>
                    <div className={styles.submit}>
                        <div className={styles.buttons}>
                            <button type="submit">Post</button>
                            <button onClick={onClose}>Cancel</button>
                        </div>
                        <p>Post your dream on your social networks!</p>
                        <div className={styles.links}>
                            <Link href="/"><Image src="/images/instagram.svg" alt="" width={25} height={25}/></Link>
                            <Link href="/"><Image src="/images/twitter.svg" alt="" width={25} height={25}/></Link>
                            <Link href="/"><Image src="/images/vk.svg" alt="" width={25} height={25}/></Link>
                        </div>
                    </div>
                </form>
                <button onClick={onClose}></button>
            </div>
        </div>
    );
};

export default Modal;
