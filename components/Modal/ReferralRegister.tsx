// Модальное регистрации в реферальной системе

import styles from "./ReferralRegister.module.scss"
import React, {useEffect, useState} from "react";
import {ModalProps} from "../../utils/types";
import {registerPartner} from "../../utils/api";
import {useRouter} from "next/router";

const Modal: React.FC<ModalProps & { userId: number }> = ({userId, onClose}) => {
    const [name, setName] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [telegram, setTelegram] = useState(null)
    const [email, setEmail] = useState(null)
    const [country, setCountry] = useState(null)
    const [organization, setOrganization] = useState(null)

    const router = useRouter()

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: {
        target: { value: any; };
    }) => {
        setter(e.target.value);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleRegister = async () => {
        const partnerData = {
            "name": name,
            "phoneNumber": phoneNumber,
            "telegramAccount": telegram,
            "email": email,
            "country": country,
            "organizationName": organization
        }
        await registerPartner(partnerData)
        router.reload()
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <form>
                    <label className={`${styles.required} ${styles.name}`}>
                        <input type="text" required placeholder="Your name" value={name}
                               onChange={handleInputChange(setName)}/>
                    </label>
                    <label className={styles.required}>Phone number:
                        <input required type={"tel"} placeholder={"+7 (927) 000-00-00"} value={phoneNumber}
                               onChange={handleInputChange(setPhoneNumber)}/>
                    </label>
                    <label>Telegram:
                        <input type={"text"} placeholder={"Nickname"} value={telegram}
                               onChange={handleInputChange(setTelegram)}/>
                    </label>
                    <label className={styles.required}> E - mail:
                        <input required type={"email"} placeholder={"sendmydream@gmail.com"} value={email}
                               onChange={handleInputChange(setEmail)}/>
                    </label>
                    <label className={styles.required}>Country:
                        <input required type={"text"} placeholder={"Choose your country"} value={country}
                               onChange={handleInputChange(setCountry)}/>
                    </label>
                    <label>Organization name:
                        <input type={"text"} placeholder={"Choose your country"} value={organization}
                               onChange={handleInputChange(setOrganization)}/>
                    </label>
                </form>
                <button onClick={onClose}></button>
                <div className={styles.buttons}>
                    <button className={styles.cancel} onClick={onClose}>Cancel</button>
                    <button className={styles.register} onClick={handleRegister}>Save changes</button>
                </div>
            </div>
        </div>
    )
        ;
};

export default Modal;
