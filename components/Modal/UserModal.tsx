// Модадльное пользователя (админ)

import styles from "./UserModal.module.scss"
import React, {useEffect, useState} from "react";
import {blockUser} from "../../utils/api";
import IncreaseBalanceModal from "./IncreaseBalanceModal";

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
    const [increaseAvailable, setIncreaseAvailable] = useState<boolean>(false)

    useEffect(() => {

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const block = async (e) => {
        e.preventDefault()
        const status = await blockUser(id, !blocked)
        setBlocked(status)
    }

    const handleModalClose = () => {
        setIncreaseAvailable(false)
        onClose()
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
                        <button type={"button"} className={styles.increase}
                                onClick={() => setIncreaseAvailable(true)}>Increase balance
                        </button>
                        <button className={styles.block}
                                onClick={block}>{blocked ? 'Unblock user' : 'Block user'}</button>
                    </div>
                </form>
                {increaseAvailable &&
                    <IncreaseBalanceModal onClose={() => handleModalClose()} userId={id} username={username}/>}
            </div>
        </div>
    )
}

export default UserModal;
