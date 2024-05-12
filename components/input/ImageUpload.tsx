import React, {useState} from 'react';
import styles from "./ImageUpload.module.scss"

const ImageUpload = () => {
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
    };

    return (
        <div>
            <input id="fileInput" type="file" accept="image/*" onChange={handleImageChange}
                   className={styles.fileInput}/>
            <label htmlFor="fileInput" className={styles.customButton}>Upload photo:
                <div style={{backgroundColor: imagePreview ? `transparent` : `#D9D9D9`}} className={styles.preview}>
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" style={{height: '200px'}}/>
                    )}
                </div>
            </label>
        </div>
    );
};

export default ImageUpload;
