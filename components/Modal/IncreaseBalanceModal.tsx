// Добавление генераций / баланса для пользователя (админ)

import styles from './Modal.module.scss'
import React, {useState} from "react";
import {handleIncreaseBalance} from "../../utils/api";

const IncreaseBalanceModal = ({userId, username, onClose}) => {
    const [coinsValue, setCoinsValue] = useState<number>(null)
    const [generationsValue, setGenerationsValue] = useState<number>(null)

    const handleGenerationsIncrement = () => {
        setGenerationsValue(generationsValue + 1);
    };

    const handleGenerationsDecrement = () => {
        if (generationsValue > 1) {
            setGenerationsValue(generationsValue - 1);
        }
    };

    const handleGenerationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue)) {
            setGenerationsValue(newValue);
        }
    };

    const handleCoinsIncrement = () => {
        setCoinsValue(coinsValue + 1);
    };

    const handleCoinsDecrement = () => {
        if (coinsValue > 1) {
            setCoinsValue(coinsValue - 1);
        }
    };

    const handleCoinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue)) {
            setCoinsValue(newValue);
        }
    };

    const handleSubmit = async () => {
        await handleIncreaseBalance(userId, coinsValue, generationsValue)
        onClose()
    }


    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.title}>
                    <h2>Balance for user {username}</h2>
                </div>
                <div className={styles.main}>
                    <div className={styles.inputChange}><span>Coins</span>
                        <button type="button" className={styles.increment} onClick={handleCoinsIncrement}></button>
                        <input
                            type="number"
                            min="1"
                            value={coinsValue}
                            onChange={handleCoinsChange}
                            className={styles.input}
                        />
                        <button type="button" className={styles.decrement} onClick={handleCoinsDecrement}></button>
                    </div>
                    <div className={styles.inputChange}><span>Generations</span>
                        <button type="button" className={styles.increment} onClick={handleGenerationsIncrement}></button>
                        <input
                            type="number"
                            min="1"
                            value={generationsValue}
                            onChange={handleGenerationsChange}
                            className={styles.input}
                        />
                        <button type="button" className={styles.decrement} onClick={handleGenerationsDecrement}></button>
                    </div>
                </div>
                <div className={styles.buttons}>
                    <button className={styles.cancel} type={"button"} onClick={onClose}>Cancel</button>
                    <button className={styles.increase} type={"button"} onClick={handleSubmit}>Increase</button>
                </div>
            </div>
        </div>
    )
}

export default IncreaseBalanceModal
