import React, { useEffect, useState } from "react";
import ImageUpload from "../input/ImageUpload";
import styles from "./Create.module.scss";
import { createDream, updateDream } from "../../utils/api";
import { CreateProps } from "../../utils/types";

const Modal: React.FC<CreateProps> = ({ name, cost, description, image, onClose, id, updateList }) => {
    const [nameValue, setNameValue] = useState<string>(name ? name : '');
    const [descriptionValue, setDescriptionValue] = useState<string>(description ? description : '');
    const [costValue, setCostValue] = useState<number>(cost ? cost : 1);
    const [imageValue, setImageValue] = useState<string | null>(image ? image : null);

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    const handleIncrement = () => {
        setCostValue(costValue + 1);
    };

    const handleDecrement = () => {
        if (costValue > 1) {
            setCostValue(costValue - 1);
        }
    };

    const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue)) {
            setCostValue(newValue);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const dreamData = {
            title: nameValue,
            description: descriptionValue,
            cost: costValue,
            image: imageValue,
        };

        try {
            if (id) {
                await updateDream(id, dreamData);
            } else {
                await createDream(dreamData);
            }
            updateList(); // Обновить список мечт после успешного запроса
            onClose();
        } catch (error) {
            console.error("Error saving dream:", error);
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>{id ? "Edit Dream" : "Create Dream"}</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.description}>
                        <div className={styles.content}>
                            <label className={styles.name}>Name
                                <input type="text" value={nameValue} onChange={handleInputChange(setNameValue)}
                                       placeholder="I have..."/>
                            </label>
                            <label className={styles.description}>Description
                                <input type="text" value={descriptionValue}
                                       onChange={handleInputChange(setDescriptionValue)}
                                       placeholder="Colorful description of desire"/>
                            </label>
                            <div className={styles.price}><span>Price</span>
                                <button type="button" className={styles.decrement} onClick={handleDecrement}>-</button>
                                <input
                                    type="number"
                                    min="1"
                                    value={costValue}
                                    onChange={handleCostChange}
                                    className={styles.input}
                                />
                                <button type="button" className={styles.increment} onClick={handleIncrement}>+</button>
                            </div>
                        </div>
                        <div className={styles.imageUpload}>
                            <ImageUpload image={imageValue}/>
                        </div>
                    </div>
                    <div className={styles.submit}>
                        <button type="button" onClick={onClose}>Delete</button>
                        <button type="submit">Save changes</button>
                    </div>
                </form>
                <button onClick={onClose}></button>
            </div>
        </div>
    );
};

export default Modal;
