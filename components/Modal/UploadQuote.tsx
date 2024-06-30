import styles from "./UploadQuote.module.scss"
import React, {useEffect, useState} from "react";
import {ModalProps} from "../../utils/types";
import {addQuote, deleteQuotes, editQuote} from "../../utils/api";

const Modal: React.FC<ModalProps & {
    id?: number,
    author?: string,
    text: string,
    onSave?: () => void,
    onDelete?: (id: number) => void
}> = ({onClose, id, author, text, onSave, onDelete}) => {
    const [authorValue, setAuthorValue] = useState(author || "")
    const [textValue, setTextValue] = useState(text || "")

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: {
        target: {
            value: any;
        };
    }) => {
        setter(e.target.value);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const sendQuote = async (e) => {
        e.preventDefault()
        if (id) {
            const quote = {
                "id": id,
                "author": authorValue,
                "text": textValue
            }
            await editQuote(quote)
            onSave()
        } else {
            const quote = {
                "author": authorValue,
                "text": textValue
            }
            await addQuote(quote)
            onSave()
        }
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>Write or edit quote</h2>
                <form>
                    <input type="text" value={authorValue} onChange={handleInputChange(setAuthorValue)}
                           placeholder={"Author"}/>
                    <textarea value={textValue} onChange={handleInputChange(setTextValue)} placeholder={"Write quote"}/>
                </form>
                <div className={styles.buttons}>
                    {id && <button className={styles.delete} onClick={() => onDelete(id)}>Delete</button>}
                    <button className={styles.save} onClick={(e) => sendQuote(e)}>Save</button>
                </div>
                <button onClick={onClose}></button>
            </div>
        </div>
    );
};

export default Modal;
