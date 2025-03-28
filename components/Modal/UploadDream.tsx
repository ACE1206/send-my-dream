// Загрузка мечты для пользователя (completed)

import styles from "./UploadDream.module.scss"
import React, {useEffect, useState} from "react";
import {DreamData, ModalProps} from "../../utils/types";
import ImageUpload from "../input/ImageUpload";
import Link from "next/link";
import Image from "next/image";
import {addCompletedDream, getUserData} from "../../utils/api";

const Modal: React.FC<ModalProps> = ({onClose}) => {
    const [name, setName] = useState(null)
    // const [description, setDescription] = useState(null)
    const [image, setImage] = useState<File>(null)
    const [sent, setSent] = useState<boolean>(false)

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: {
        target: { value: any; };
    }) => {
        setter(e.target.value);
    };

    const handleImageChange = (file: File | null) => {
        setImage(file);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const sendDream = async (e) => {
        e.preventDefault()
        const user = await getUserData();
        const formData = new FormData();
        formData.append("name", name);
        // formData.append("description", description);
        formData.append("image", image);
        formData.append("userId", user.id);
        await addCompletedDream(formData).then(() => setSent(true))
        setTimeout(() => {
            onClose()
        }, 3000)
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {sent ? (
                    <h2>Your dream was sent for moderation!</h2>
                ) : (
                    <form>
                        {/*<input className={styles.heading} required type="text" placeholder="Heading" value={name}*/}
                        {/*       onChange={handleInputChange(setName)}/>*/}
                        <label className={styles.description}>Share your completed dream!
                            <input required placeholder="Write here" value={name}
                                      onChange={handleInputChange(setName)}/>
                        </label>
                        <ImageUpload onImageChange={handleImageChange}/>
                        <div className={styles.submit}>
                            <div className={styles.buttons}>
                                <button type="submit" onClick={sendDream}>Post</button>
                                <button onClick={onClose}>Cancel</button>
                            </div>
                            {/*<p>Post your dream on your social networks!</p>*/}
                            {/*<div className={styles.links}>*/}
                            {/*    <Link href="/"><Image src="/images/instagram.svg" alt="" width={25}*/}
                            {/*                          height={25}/></Link>*/}
                            {/*    <Link href="/"><Image src="/images/twitter.svg" alt="" width={25}*/}
                            {/*                          height={25}/></Link>*/}
                            {/*    <Link href="/"><Image src="/images/vk.svg" alt="" width={25} height={25}/></Link>*/}
                            {/*</div>*/}
                        </div>
                    </form>
                )}
                <button onClick={onClose}></button>
            </div>
        </div>
    );
};

export default Modal;
