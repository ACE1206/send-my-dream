import styles from './Payment.module.scss'
import React from "react";
import Image from "next/image";
import {makePayment} from "../../utils/api";
import {useRouter} from "next/router";

const Payment: React.FC<{
    onClose: () => void,
    data: any
}> = ({onClose, data}) => {
    const router = useRouter();

    const handleSelect = async (payment: any) => {
        try {
            const response = await makePayment(
                data.user,
                data.coins,
                data.generations,
                data.purchaseValue,
                data.promoCode,
                payment
            )
            if (response.approvalUrl) {
                await router.push(response.approvalUrl)
            } else if (response.yookassa.confirmation) {
                await router.push(response.yookassa.confirmation.confirmation_url)
            } else {
                console.error('Approval URL not found');
            }
        } catch (error) {
            console.error('Payment creation failed', error);
        }
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>Choose payment system</h2>
                <div>
                    <button className={styles.yookassa} onClick={() => handleSelect("YooKassa")}>
                        <Image src={"/images/yookassa.png"} alt={"YooKassa"} width={1000} height={1000}/>
                        <span>YooKassa</span>
                    </button>
                    <button className={styles.paypal} onClick={() => handleSelect("PayPal")}>
                        <Image src={"/images/paypal.png"} alt={"PayPal"} width={1000} height={1000}/>
                        <span>PayPal</span>
                    </button>
                </div>
                <button onClick={onClose}></button>
            </div>
        </div>
    )
}

export default Payment
