import React, {useEffect} from "react";
import styles from "./ConfirmDelete.module.scss";

const ConfirmDelete: React.FC<{ category?: number, dream?: number, onClose: () => void, onDelete: () => void }> = ({onClose, onDelete, dream, category}) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>Are you sure?</h2>
                <div className={styles.buttons}>
                    <button className={styles.cancel} onClick={onClose}>Cancel</button>
                    <button className={styles.delete} onClick={onDelete}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDelete
