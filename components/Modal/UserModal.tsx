import styles from "./UserModal.module.scss"
import React, {useEffect, useState} from "react";
import ImageUpload from "../input/ImageUpload";
import Link from "next/link";
import Image from "next/image";
import user from "../../data/partner.json"
import {blockUser} from "../../utils/api";

type ModalProps = {
    id: number
    username: string
    email: string
    country?: string
    gender?: string
    balance: number
    totalPayment: number
    referral: boolean
    createdAt: string
    isBlocked: boolean
    onClose: () => void
}

const UserModal: React.FC<ModalProps> = ({
                                             id,
                                             username,
                                             email,
                                             country,
                                             gender,
                                             balance,
                                             totalPayment,
                                             referral,
                                             createdAt,
                                             isBlocked,
                                             onClose
                                         }) => {

    const [blocked, setBlocked] = useState<boolean>(isBlocked || false)

    useEffect(() => {

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const block = async (e) => {
        e.preventDefault()
        console.log(blocked)
        if (!isBlocked) {
            await blockUser(id)
            setBlocked(true)
        }
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.title}>
                    <h2>{username}</h2>
                    <span>Partner since {createdAt}</span>
                </div>
                <form>
                    <div className={styles.userInfo}>
                        <div className={styles.contactInfo}>
                            <label>E-mail:
                                <input disabled type="text" value={email}/>
                            </label>
                            <label>Country:
                                <input disabled type="text" value={country}/>
                            </label>
                            <label>Gender:
                                <input disabled type="text" value={gender}/>
                            </label>
                        </div>
                        <div className={styles.balanceInfo}>
                            <label>Balance:
                                <input disabled type="number" value={balance}/>
                            </label>
                            <label>Total payment:
                                <input disabled type="text" value={totalPayment}/>
                            </label>
                        </div>
                    </div>
                    <div className={styles.paymentInfo}>
                        <label>Referal:
                            <input disabled type="text" value={referral ? `Yes` : 'No'}/>
                        </label>
                        <label>Invoice for payment:
                            <input disabled type="text" value={""}/>
                        </label>
                    </div>
                    <div className={styles.buttons}>
                        <button disabled={blocked} className={styles.block}
                                onClick={block}>{blocked ? 'Blocked' : 'Block user'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserModal;
