import styles from "../../styles/Store.module.scss"
import React, {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header/Header";
import deposit from "../../data/deposit.json"
import MobileMenu from "../../components/Menu/MobileMenu";
import withAuth from "../../components/HOC/withAuth";
import {getUserData, makePurchase} from "../../utils/api";

const Store: React.FC = () => {
    const [user, setUser] = useState(null);
    const [selectedValue, setSelectedValue] = useState<{ coin: number, cost: number }>(null)
    const [promoCode, setPromoCode] = useState('')

    useEffect(() => {
        updateUser()
    }, []);

    const updateUser = async () => {
        const fetchUser = await getUserData();
        setUser(fetchUser)
    }

    const buyCoins = async (e, coins, cost) => {
        const data = {
            "user": user.id,
            "coins": coins,
            "purchaseValue": cost,
            "promoCode": promoCode
        }
        await makePurchase(data)
        updateUser();
    }

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    return (
        <div className={styles.store}>
            <Header/>
            <section className={styles.container}>
                <div className={styles.content}>
                    <h1>Coin store</h1>
                    <div className={styles.info}>
                        <div className={styles.name}>
                            <Image src="/images/account/avatar.png" alt="" width={100} height={100}/>
                            {user && <h3>{user.username}</h3>}
                        </div>
                        <div className={styles.balance}>
                            <Image src="/images/account/balance-icon.png" alt="" width={100} height={100}/>
                            <h3>Balance</h3>
                            {user && <span>{user.balance}</span>}
                        </div>
                    </div>
                    <div className={styles.deposit}>
                        <div>
                            <h3>One-time purchase</h3>
                            {deposit.map((dep, index: React.Key) => (
                                <button key={index} onClick={() => setSelectedValue({coin: dep.coin, cost: dep.cost})}
                                        className={selectedValue && selectedValue.coin === dep.coin ? styles.selected : ``}>
                                    <span className={styles.coin}>{dep.coin}</span>
                                    <span className={styles.cost}>${dep.cost}</span>
                                </button>
                            ))}
                            <label>
                                <input type="text" placeholder="Promo code" className={styles.promoCode}
                                       value={promoCode} onChange={handleInputChange(setPromoCode)}/>
                            </label>
                            <button type={"submit"} disabled={!selectedValue}
                                    onClick={(e) => buyCoins(e, selectedValue.coin, selectedValue.cost)}>Buy coins
                            </button>
                        </div>
                        <div>
                            <h3>3 month subscription</h3>
                            <button>
                                <span className={styles.coin}>750</span>
                                <span className={styles.cost}>$50\month</span>
                            </button>
                            <p>You will be charged total amount of <b>$150</b></p>
                            <h4>Buying SMD coins by subscription is 2 times more profitable!</h4>
                            <label>
                                <input type="text" placeholder="Promo code" className={styles.promoCode}
                                       value={promoCode} onChange={handleInputChange(setPromoCode)}/>
                            </label>
                            <button type={"submit"} onClick={(e) => buyCoins(e, 750, 150)}>Subscribe</button>
                        </div>
                    </div>
                </div>
                <Link href="/account/">Back to Area</Link>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Store)
