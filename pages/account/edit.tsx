import styles from "../../styles/AccountEdit.module.scss"
import React from "react";
import Header from "../../components/Header/Header";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "../../components/Menu/MobileMenu";
import withAuth from "../../components/HOC/withAuth";

const Edit: React.FC = () => {
    return (
        <div className={styles.profile}>
            <Header/>
            <section className={styles.container}>
                <div className={styles.content}>
                    <h1>Personal account</h1>
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
                    <div className={styles.edit}>
                        <form>
                            <label>How can we call you?
                                <input type="text" placeholder="John"/>
                            </label>
                            <label>What is your gender?
                                <div>
                                    <select name="gender">
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    <div className={styles.selectArrow}>∨</div>
                                </div>
                            </label>
                            <label>E-mail
                                <input type="text" placeholder="Sendmydream@gmail.com"/>
                            </label>
                        </form>
                        <div className={styles.avatar}>
                            <Image src="/images/account/avatar.png" alt="" width={350} height={350}/>
                            <button></button>
                        </div>
                    </div>
                </div>
                <Link href="/">Go back</Link>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Edit)
