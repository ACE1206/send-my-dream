import styles from "./Create.module.scss";
import React, { useEffect, useState } from "react";
import ImageUpload from "../input/ImageUpload";
import { CreateProps } from "../../utils/types";

const Modal: React.FC<CreateProps> = ({ name, cost, description, image, onClose }) => {
    const [nameValue, setNameValue] = useState<string>(name ? name : '');
    const [descriptionValue, setDescriptionValue] = useState<string>(description ? description : '');
    const [costValue, setCostValue] = useState<number>(cost ? cost : 0);
    const [imageValue, setImageValue] = useState<string | null>(image ? image : null);

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCostValue(parseFloat(e.target.value));
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>Create or Edit</h2>
                <form>
                    <div className={styles.description}>
                        <div>
                            <label className={styles.name}>Name
                                <input type="text" value={nameValue} onChange={handleInputChange(setNameValue)} placeholder="I have..." />
                            </label>
                            <label className={styles.description}>Description
                                <input type="text" value={descriptionValue} onChange={handleInputChange(setDescriptionValue)} placeholder="Colorful description of desire" />
                            </label>
                            <label className={styles.price}>Price
                                <input type="number" value={costValue} onChange={handleCostChange} />
                            </label>
                        </div>
                        <div className={styles.imageUpload}>
                            <ImageUpload image={imageValue} />
                        </div>
                    </div>
                    <div className={styles.submit}>
                        <button type="submit">Delete</button>
                        <button onClick={onClose}>Save changes</button>
                    </div>
                </form>
                <button onClick={onClose}></button>
            </div>
        </div>
    );
};

export default Modal;
