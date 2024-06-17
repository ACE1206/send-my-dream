import styles from "./UserModal.module.scss"
import React, {useEffect, useState} from "react";
import {updatePartner} from "../../utils/api";
import {useRouter} from "next/router";

type ModalProps = {
    id: number
    name: string
    percent: string
    email: string
    mustBePaid: number
    totalEarned: number
    profitPercentage: number
    invoice: number
    pay_system: string
    phoneNumber: string
    country: string
    created_at: string
    onClose: () => void;
}

const PartnerModal: React.FC<ModalProps> = ({
                                                id,
                                                country,
                                                created_at,
                                                phoneNumber,
                                                invoice,
                                                email,
                                                name,
                                                totalEarned,
                                                profitPercentage,
                                                pay_system,
                                                mustBePaid,
                                                onClose
                                            }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const router = useRouter()

    const [phoneNumberValue, setPhoneNumberValue] = useState(phoneNumber);
    const [profitPercentageValue, setProfitPercentageValue] = useState<number>(profitPercentage);
    const [emailValue, setEmailValue] = useState(email);
    const [countryValue, setCountryValue] = useState(country);
    const [mustBePaidValue, setMustBePaidValue] = useState(mustBePaid);
    const [earnedValue, setEarnedValue] = useState(totalEarned);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const savePartner = async (e) => {
        e.preventDefault()
        const partnerData = {
            "phoneNumber": phoneNumberValue,
            "email": emailValue,
            "country": countryValue,
            "mustBePaid": mustBePaidValue,
            "totalEarned": earnedValue,
            "profitPercentage": profitPercentageValue
        }
        await updatePartner(id, partnerData)
        router.reload()
    }

    const handleDecrement = () => {
        if (profitPercentageValue > 1) {
            setProfitPercentageValue(profitPercentageValue - 1);
        }
    };

    const handleIncrement = () => {
        if (profitPercentageValue < 100) {
            setProfitPercentageValue(profitPercentageValue + 1);
        }
    };

    const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue)) {
            setProfitPercentageValue(newValue);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <span>Partner since {created_at}</span>
                <div className={styles.nameBlock}>
                    <h2>{name}</h2>
                    <div className={styles.price}>
                        <button type="button" className={styles.decrement} onClick={handleDecrement}></button>
                        <input
                            type="text"
                            disabled
                            value={`${profitPercentageValue}%`}
                            onChange={handleCostChange}
                            className={styles.input}
                        />
                        <button type="button" className={styles.increment} onClick={handleIncrement}></button>
                    </div>
                </div>
                <form>
                    <div className={styles.userInfo}>
                        <div className={styles.contactInfo}>
                            <label>Phone number:
                                <input type="text" value={phoneNumberValue}
                                       onChange={handleInputChange(setPhoneNumberValue)}/>
                            </label>
                            <label>E-mail:
                                <input type="text" value={emailValue} onChange={handleInputChange(setEmailValue)}/>
                            </label>
                            <label>Country:
                                <input type="text" value={countryValue} onChange={handleInputChange(setCountryValue)}/>
                            </label>
                        </div>
                        <div className={styles.balanceInfo}>
                            <label>Must be paid:
                                <input type="text" value={mustBePaidValue}
                                       onChange={handleInputChange(setMustBePaidValue)}/>
                            </label>
                            <label>Earned all the time:
                                <input type="text" value={earnedValue} onChange={handleInputChange(setEarnedValue)}/>
                            </label>
                        </div>
                    </div>
                    <div className={styles.paymentInfo}>
                        <label>Pay system:
                            <input disabled type="text" value={pay_system}/>
                        </label>
                        <label>Invoice for payment:
                            <input disabled type="text" value={invoice}/>
                        </label>
                    </div>
                    <div className={styles.buttons}>
                        <button type="submit" onClick={savePartner}>Save changes</button>
                        <button onClick={onClose}>Pay</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PartnerModal;
