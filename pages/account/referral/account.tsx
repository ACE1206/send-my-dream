import styles from '../../../styles/ReferralAccount.module.scss'
import React, {useEffect, useState} from "react";
import Header from "../../../components/Header/Header";
import withAuth from "../../../components/HOC/withAuth";
import {getPartnerByUserId, getPartnerPurchases, getUserData} from "../../../utils/api";
import Image from "next/image";
import {useRouter} from "next/router";
import ReferralRegister from "../../../components/Modal/ReferralRegister";
import Head from "next/head";
import MobileMenu from "../../../components/Menu/MobileMenu";
import Link from "next/link";
import PaymentInfo from "../../../components/Modal/PaymentInfo";

const Account: React.FC = () => {
    const [user, setUser] = useState(null)
    const [partner, setPartner] = useState(null)
    const [registerAccount, setRegisterAccount] = useState(false)
    const [referralUsers, setReferralUsers] = useState([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    const router = useRouter()

    useEffect(() => {
        updateUser()
    }, []);

    const updateUser = async () => {
        const fetchUser = await getUserData();
        setUser(fetchUser);
        if (fetchUser.isPartner) {
            const fetchPartner = await getPartnerByUserId(fetchUser.id)
            if (fetchPartner) {
                setPartner(fetchPartner);
                const fetchReferralUsers = await getPartnerPurchases(fetchPartner.id)
                setReferralUsers(fetchReferralUsers)
            } else {
                setRegisterAccount(true)
            }
        }
    };

    const backUrl = () => {
        return router.push("/account/referral/")
    }

    return (
        <div className={styles.account}>
            <Head>
                <title>Referral Account</title>
            </Head>
            <Header/>
            <section>
                <h1>Affiliate account</h1>
            </section>
            <section className={styles.content}>
                <div className={`hide-on-mobile ${styles.left}`}>
                    <div className={styles.info}>
                        <div className={styles.name}>
                            <Image src={user && user.avatar || "/images/account/avatar.png"} alt="" width={60}
                                   height={60}/>
                            <h3>{user && user.username}</h3>
                        </div>
                        <div className={styles.available}>
                            <h3>Available for withdrawal</h3>
                            <span>${partner && partner.mustBePaid || 0}</span>
                        </div>
                    </div>
                    <div className={styles.tableBorder}>
                        <table>
                            <thead>
                            <tr>
                                <th>User ID</th>
                                <th>To be paid</th>
                                <th>Clients paid</th>
                                <th>Payment date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {referralUsers.map((ru, index: React.Key) => (
                                <tr key={index}>
                                    <td>ID: {ru.user.id}</td>
                                    <td>${ru.commission}</td>
                                    <td>${ru.purchaseValue}</td>
                                    <td>{ru.purchaseDate}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td>Quantity: {referralUsers.length}</td>
                                <td>Total ${referralUsers.reduce((acc, num) => acc + num.commission, 0)}</td>
                                <td>Total ${referralUsers.reduce((acc, num) => acc + num.purchaseValue, 0)}</td>
                                <td></td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <div className={`hide-on-mobile ${styles.right}`}>
                    <div className={styles.info}>
                        <div>
                            <h3>Total earned</h3>
                            <span>${partner && partner.totalEarned || 0}</span>
                        </div>
                        <div>
                            <h3>Payment expected</h3>
                            <span>${partner && partner.totalEarned || 0}</span>
                        </div>
                        <div>
                            <h3>Users invited</h3>
                            <span>{user && user.invites || 0}</span>
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <button className={styles.withdraw} onClick={() => setIsModalOpen(true)}>Withdraw funds</button>
                        <Link href={"/account/referral"} className={styles.cancel}>Go back</Link>
                    </div>
                </div>

                <div className={`hide-on-desktop ${styles.mobile}`}>
                    <div className={styles.name}>
                        <Image src={user && user.avatar || "/images/account/avatar.png"} alt="" width={60}
                               height={60}/>
                        <h3>{user && user.username}</h3>
                    </div>
                    <div className={styles.available}>
                        <h3>Available for withdrawal</h3>
                        <span>${partner && partner.mustBePaid || 0}</span>
                    </div>
                    <div className={styles.total}>
                        <h3>Total paid</h3>
                        <span>${partner && partner.totalEarned || 0}</span>
                    </div>
                    <div>
                        <h3>Users invited</h3>
                        <span>{user && user.invites || 0}</span>
                    </div>
                </div>
            </section>
            {isModalOpen && <PaymentInfo onClose={() => {
                setIsModalOpen(false)
                updateUser()
            }} partnerId={partner.id} amount={partner.mustBePaid}/>}
            {registerAccount && <ReferralRegister userId={user.id} onClose={() => backUrl()}/>}
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Account)
