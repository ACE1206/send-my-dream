import styles from "./BuyGenerations.module.scss";
import React, {useEffect, useState} from "react";
import {buyGenerations} from "../../utils/api";
import {ModalProps} from "../../utils/types";
import InsufficientModal from "./InsufficientModal";
import Image from "next/image";

const BuyGenerations = ({userId, balance, onClose}) => {
    const [generationsValue, setGenerationsValue] = useState<number>(10)
    const [coinsValue, setCoinsValue] = useState<number>(1)
    const [purchaseModalOpen, setPurchaseModalOpen] = useState<ModalProps>(null)

    const handleDecrement = () => {
        if (generationsValue > 10) {
            setGenerationsValue(generationsValue - 10);
        }
    };

    const handleConfirm = async (e) => {
        e.preventDefault()
        if (coinsValue > balance) {
            setPurchaseModalOpen({totalPrice: coinsValue, balance: balance})
        } else {
            const data = {
                user: userId,
                generations: generationsValue,
                coins: coinsValue,
            }
            await buyGenerations(data)
            onClose()
        }
    };

    const handleIncrement = () => {
        if (generationsValue < 1000) {
            setGenerationsValue(generationsValue + 10);
        }
    };

    useEffect(() => {
        setCoinsValue(generationsValue / 10)
    }, [generationsValue]);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h2>You can by AI generations for coins</h2>
                <p>Buy additional generations using SMD coins</p>
                <div className={styles.content}>
                    <div className={styles.price}>
                        <div className={styles.input}>
                            <button type="button" className={styles.increment} onClick={handleIncrement}></button>
                            <span>{generationsValue}</span>
                            <button type="button" className={styles.decrement} onClick={handleDecrement}></button>
                        </div>
                        <div className={styles.text}>
                            <div>
                            <Image src={"/images/gpt.png"} alt={''} width={50} height={50}/>
                            <Image src={"/images/fusion.png"} alt={''} width={50} height={50}/>
                            </div>
                            <h5>generations</h5>
                        </div>
                    </div>
                    <div className={styles.cost}>
                        <p>=</p>
                        <span className={styles.costValue}>{coinsValue}</span>
                    </div>
                </div>
                <button className={styles.confirm} onClick={handleConfirm}>Buy generations</button>
                <button className={styles.close} onClick={onClose}></button>
            </div>
            {purchaseModalOpen &&
                <InsufficientModal totalPrice={coinsValue} balance={balance}
                                   onClose={() => setPurchaseModalOpen(null)}/>}
        </div>
    )
}

export default BuyGenerations
