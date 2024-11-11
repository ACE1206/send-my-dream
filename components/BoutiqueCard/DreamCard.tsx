// Карточка в мотивации (мечты)

import styles from './DreamCard.module.scss';
import React, {useEffect, useState} from "react";
import {DreamData} from "../../utils/types";
import Image from "next/image";
import {deleteCompletedDream} from "../../utils/api";
import ConfirmDelete from "../Modal/ConfirmDelete";

type DreamCardProps = DreamData & {
    id?: number;
    openModal: (dreamCard: DreamData) => void;
    editable?: boolean;
    onSave?: () => void;
};

const DreamCard: React.FC<DreamCardProps> = ({
                                                 id,
                                                 date,
                                                 img,
                                                 avatar,
                                                 author,
                                                 text,
                                                 description,
                                                 openModal,
                                                 editable,
                                                 onSave
                                             }) => {
    const [remove, setRemove] = useState(null);

    const deleteDream = async () => {
        await deleteCompletedDream(id).then(() => setRemove(null)).then(onSave)
    }

    return (
        <div className={styles.dreams} onClick={() => openModal({date, img, avatar, author, text, description})}>
            <Image src={img} alt={text} width={500} height={500}/>
            <div className={styles.dreamCardContent}>
                <Image src={avatar} alt={author} width={220} height={320}/>
                <span>{author}</span>
            </div>
            {editable &&
                <div className={`hide-on-mobile`} onClick={e => e.stopPropagation()}>
                    <button onClick={e => {
                        setRemove(id);
                    }} className={styles.delete}><Image src={'/images/account/trash.svg'} alt={''} width={30}
                                                        height={30}/>
                    </button>
                    {remove && <ConfirmDelete onClose={() => setRemove(null)} onDelete={() => deleteDream()}/>}
                </div>
            }
        </div>
    );
};

export default DreamCard;
