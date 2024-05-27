import styles from "../../styles/Store.module.scss"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header/Header";
import deposit from "../../data/deposit.json"
import MobileMenu from "../../components/Menu/MobileMenu";
import withAuth from "../../components/HOC/withAuth";

const Store: React.FC = () => {
    return (
        <div className={styles.store}>
            <Header/>
            <section className={styles.container}>
                <div className={styles.content}>
                    <h1>Coin store</h1>
                    <div className={styles.info}>
                        <div className={styles.name}>
                            <Image src="/images/account/avatar.png" alt="" width={100} height={100}/>
                            <h3>John Smith</h3>
                        </div>
                        <div className={styles.balance}>
                            <Image src="/images/account/balance-icon.png" alt="" width={100} height={100}/>
                            <h3>Balance</h3>
                            <span>2000</span>
                            <Link href="/">+</Link>
                        </div>
                    </div>
                    <div className={styles.deposit}>
                        <div>
                            <h3>One-time purchase</h3>
                            {deposit.map((dep, index: React.Key) => (
                                <div key={index}>
                                    <span className={styles.coin}>{dep.coin}</span>
                                    <span className={styles.cost}>${dep.cost}</span>
                                </div>
                            ))}
                            <label>
                                <input type="text" placeholder="Promo code" className={styles.promoCode}/>
                            </label>
                            <button type="submit">Buy coins</button>
                        </div>
                        <div>
                            <h3>3 month subscription</h3>
                            <div>
                                <span className={styles.coin}>750</span>
                                <span className={styles.cost}>$50\month</span>
                            </div>
                            <p>You will be charged total amount of <b>$150</b></p>
                            <h4>Buying SMD coins by subscription is 2 times more profitable!</h4>
                            <label>
                                <input type="text" placeholder="Promo code" className={styles.promoCode}/>
                            </label>
                            <button>Subscribe</button>
                        </div>
                    </div>
                </div>
                <Link href="/">Back to Area</Link>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Store)
