// Создание / Изменение категории

import React, { useEffect, useState } from "react";
import ImageUpload from "../input/ImageUpload";
import styles from "./Create.module.scss";
import {createCategory, deleteCategory, deleteDream, updateCategory} from "../../utils/api";
import { CreateProps } from "../../utils/types";
import ConfirmDelete from "./ConfirmDelete";

const Modal: React.FC<CreateProps> = ({ name, cost, image, onClose, id, updateList}) => {
    const [titleValue, setTitleValue] = useState<string>(name ? name : '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    const handleImageChange = (file: File | null) => {
        setImageFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", titleValue);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            if (id) {
                await updateCategory(id, formData);
            } else {
                await createCategory(formData);
            }
            updateList();
            onClose();
        } catch (error) {
            console.error("Error saving dream:", error);
        }
    };

    const confirmDelete = async () => {
        if (id) {
            await deleteCategory(id);
            setShowConfirmDelete(false)
            updateList();
            onClose();
        }
    };

    const handleDelete = () => {
        setShowConfirmDelete(true);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>{id ? "Edit Category" : "Create Category"}</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className={styles.description}>
                        <div className={styles.content}>
                            <label className={styles.name}>Title
                                <input type="text" value={titleValue} onChange={handleInputChange(setTitleValue)}
                                       placeholder="I have..."/>
                            </label>
                        </div>
                        <div className={styles.imageUpload}>
                            <ImageUpload image={image} onImageChange={handleImageChange} />
                        </div>
                    </div>
                    <div className={styles.submit}>
                        {id && <button type="button" onClick={handleDelete}>Delete</button>}
                        <button type="submit">Save changes</button>
                    </div>
                </form>
                <button onClick={onClose}></button>
                {showConfirmDelete && (
                    <ConfirmDelete
                        onClose={() => setShowConfirmDelete(false)}
                        onDelete={confirmDelete}
                    />
                )}
            </div>
        </div>
    );
};

export default Modal;
