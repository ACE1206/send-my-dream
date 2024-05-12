import styles from "./UserModal.module.scss"
import React, {useEffect, useState} from "react";
import ImageUpload from "../input/ImageUpload";
import Link from "next/link";
import Image from "next/image";
import user from "../../data/partner.json"

type ModalProps = {
    user_id: number
    name: string
    email: string
    country: string
    gender: string
    balance: number
    earned: number
    referral: number
    created_at: string
    onClose: () => void;
}

const UserModal: React.FC<ModalProps> = ({
                                             user_id,
                                             name,
                                             email,
                                             country,
                                             gender,
                                             balance,
                                             earned,
                                             referral,
                                             created_at,
                                             onClose
                                         }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const [emailValue, setEmailValue] = useState(email);
    const [countryValue, setCountryValue] = useState(country);
    const [genderValue, setGenderValue] = useState(gender);
    const [balanceValue, setBalanceValue] = useState(balance);
    const [earnedValue, setEarnedValue] = useState(earned);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.title}>
                    <h2>{name}</h2>
                    <span>Partner since {created_at}</span>
                </div>
                <form>
                    <div className={styles.userInfo}>
                        <div className={styles.contactInfo}>
                            <label>E-mail:
                                <input type="text" value={emailValue} onChange={handleInputChange(setEmailValue)}/>
                            </label>
                            <label>Country:
                                <input type="text" value={countryValue} onChange={handleInputChange(setCountryValue)}/>
                            </label>
                            <label>Gender:
                                <input type="text" value={genderValue}
                                       onChange={handleInputChange(setGenderValue)}/>
                            </label>
                        </div>
                        <div className={styles.balanceInfo}>
                            <label>Balance:
                                <input type="number" value={balanceValue}
                                       onChange={handleInputChange(setBalanceValue)}/>
                            </label>
                            <label>Total payment:
                                <input type="text" value={earnedValue} onChange={handleInputChange(setEarnedValue)}/>
                            </label>
                        </div>
                    </div>
                    <div className={styles.paymentInfo}>
                        <label>Referal:
                            <input disabled={true} type="text" value={`ID${referral}`}/>
                        </label>
                        <label>Invoice for payment:
                            <input disabled={true} type="text" value={created_at}/>
                        </label>
                    </div>
                    <div className={styles.buttons}>
                        <button type="submit">Block user</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserModal;
