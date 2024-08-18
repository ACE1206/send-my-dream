// Загрузка изображения

import React, { useState, useRef, useCallback } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Modal from 'react-modal';
import styles from "./ImageUpload.module.scss";

type ImageProps = {
    image?: string;
    onImageChange?: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageProps> = ({ image, onImageChange }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(image ? image : null);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const cropperRef = useRef<ReactCropperElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            previewFile(file);
        } else {
            onImageChange(null);
        }
    };

    const previewFile = useCallback((file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setImagePreview(reader.result);
                setModalIsOpen(true);
            }
        };
    }, []);

    const handleCrop = useCallback(() => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            cropper.getCroppedCanvas().toBlob((blob) => {
                if (blob) {
                    const croppedFile = new File([blob], 'croppedImage.png', { type: 'image/png' });
                    setImagePreview(URL.createObjectURL(blob));
                    setModalIsOpen(false);
                    onImageChange(croppedFile);
                }
            }, 'image/png');
        }
    }, [onImageChange]);

    const closeModal = useCallback(() => {
        setModalIsOpen(false);
    }, []);

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
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Crop Image"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <h2>Crop Image</h2>
                {imagePreview && (
                    <Cropper
                        src={imagePreview}
                        style={{ height: 400, width: '100%' }}
                        // Cropper.js options
                        initialAspectRatio={1}
                        aspectRatio={1}
                        guides={false}
                        ref={cropperRef}
                        viewMode={1}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                    />
                )}
                <button onClick={handleCrop} className={styles.cropButton}>Apply</button>
                <button onClick={closeModal} className={styles.cancelButton}>Cancel</button>
            </Modal>
        </div>
    );
};

export default ImageUpload;
