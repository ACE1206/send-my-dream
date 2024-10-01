// Модальное выбора метода оплаты

import styles from './Payment.module.scss'
import React, {useEffect} from "react";
import Image from "next/image";
import {makePayment} from "../../utils/api";
import {useRouter} from "next/router";

const Payment: React.FC<{
    onClose: () => void,
    data: any
}> = ({onClose, data}) => {
    const router = useRouter();

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

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
            if (response.url) {
                await router.push(response.url)
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
                        <Image src={"/images/yookassa.webp"} alt={"YooKassa"} width={1000} height={1000}/>
                        <span>YooKassa</span>
                    </button>
                    <button className={styles.stripe} onClick={() => handleSelect("Stripe")}>
                        <Image src={"/images/stripe.webp"} alt={"Stripe"} width={1000} height={1000}/>
                        <span>Stripe</span>
                    </button>
                </div>
                <button onClick={onClose}></button>
            </div>
        </div>
    )
}

export default Payment
