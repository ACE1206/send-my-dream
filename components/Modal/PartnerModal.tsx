import styles from "./UserModal.module.scss"
import React, {useEffect, useState} from "react";

type ModalProps = {
    user_id: number
    name: string
    percent: string
    email: string
    must_be_paid: number
    earned: number
    invoice: number
    pay_system: string
    phone_number: string
    country: string
    created_at: string
    onClose: () => void;
}

const PartnerModal: React.FC<ModalProps> = ({
                                             user_id,
                                             country,
                                             created_at,
                                             phone_number,
                                             invoice,
                                             email,
                                             name,
                                             earned,
                                             percent,
                                             pay_system,
                                             must_be_paid,
                                             onClose
                                         }) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const [phoneNumber, setPhoneNumber] = useState(phone_number);
    const [emailValue, setEmailValue] = useState(email);
    const [countryValue, setCountryValue] = useState(country);
    const [mustBePaid, setMustBePaid] = useState(must_be_paid);
    const [earnedValue, setEarnedValue] = useState(earned);
    const [paySystemValue, setPaySystemValue] = useState(pay_system);
    const [invoiceValue, setInvoiceValue] = useState(invoice);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <span>Partner since {created_at}</span>
                <h2>{name}</h2>
                <form>
                    <div className={styles.userInfo}>
                        <div className={styles.contactInfo}>
                            <label>Phone number:
                                <input type="text" value={phoneNumber} onChange={handleInputChange(setPhoneNumber)}/>
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
                                <input type="text" value={mustBePaid} onChange={handleInputChange(setMustBePaid)}/>
                            </label>
                            <label>Earned all the time:
                                <input type="text" value={earnedValue} onChange={handleInputChange(setEarnedValue)}/>
                            </label>
                        </div>
                    </div>
                    <div className={styles.paymentInfo}>
                        <label>Pay system:
                            <input type="text" value={paySystemValue} onChange={handleInputChange(setPaySystemValue)}/>
                        </label>
                        <label>Invoice for payment:
                            <input type="text" value={invoiceValue} onChange={handleInputChange(setInvoiceValue)}/>
                        </label>
                    </div>
                    <div className={styles.buttons}>
                        <button type="submit">Save changes</button>
                        <button onClick={onClose}>Pay</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PartnerModal;
