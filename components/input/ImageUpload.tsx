import React, { useState } from 'react';
import styles from "./ImageUpload.module.scss";

type ImageProps = {
    image?: string;
    onImageChange: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageProps> = ({ image, onImageChange }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(image ? image : null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            previewFile(file);
            onImageChange(file);
        } else {
            onImageChange(null);
        }
    };

    const previewFile = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setImagePreview(reader.result);
            }
        };
    };

    return (
        <div>
            <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
            />
            <label htmlFor="fileInput" className={styles.customButton}>
                Upload photo:
                <div style={{ backgroundColor: imagePreview ? 'transparent' : '#D9D9D9' }} className={styles.preview}>
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className={styles.image} />
                    )}
                </div>
            </label>
        </div>
    );
};

export default ImageUpload;
