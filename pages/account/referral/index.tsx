import styles from '../../../styles/Referral.module.scss'
import React, {useEffect, useState} from "react";
import Header from "../../../components/Header/Header";
import Link from "next/link";
import {changePromoCode, checkPromoCode, getPartnerByUserId, getUserData} from "../../../utils/api";
import {useRouter} from "next/router";
import withAuth from "../../../components/HOC/withAuth";
import classNames from 'classnames';
import MobileMenu from "../../../components/Menu/MobileMenu";

const Referral: React.FC = () => {
    const [user, setUser] = useState(null)
    const [partner, setPartner] = useState(null)
    const [promoCode, setPromoCode] = useState<string>("");
    const [promoCodeAvailable, setPromoCodeAvailable] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);

    const router = useRouter()

    useEffect(() => {
        const updateUser = async () => {
            const fetchUser = await getUserData();
            setUser(fetchUser);
            if (fetchUser.promoCode != null) {
                setPromoCode(fetchUser.promoCode)
            }
            if (fetchUser.isPartner) {
                const fetchPartner = await getPartnerByUserId(fetchUser.id)
                setPartner(fetchPartner);
            }
        };
        updateUser()
    }, []);

    const handleInputChange = (setter: (arg0: any) => void) => async (e) => {
        setter(e.target.value);
        if (promoCode != "") {
            const status = await checkPromoCode(user.id, promoCode)
            if (status) {
                setPromoCodeAvailable(true)
            } else {
                setPromoCodeAvailable(false)
            }
        }
    };

    const routeBack = async () => {
        if (promoCodeAvailable && promoCode != "") {
            await changePromoCode(user.id, promoCode);
        }
        router.push('/account/')
    }

    const copyTextToClipboard = async () => {
        const link = `https://space-link.online/account/register?referral=${user.referralLink}`
        if ('clipboard' in navigator) {
            setCopied(true)
            setTimeout(() => {
                setCopied(false);
            }, 3000);
            return await navigator.clipboard.writeText(link);
        } else {
            setCopied(true)
            setTimeout(() => {
                setCopied(false);
            }, 3000);
            return document.execCommand('copy', true, link);
        }
    }

    return (
        <div className={styles.referral}>
            <Header/>
            <section>
                <div className={styles.title}>
                    <h1>Earn income with <br/>
                        Send My Dream!</h1>
                    <span>Share promo codes for a discount on SMD coins and earn revenue from sales</span>
                </div>

                <div className={styles.content}>
                    <div>
                        <h3>Get 2 Free coins by inviting friends</h3>
                        <p>Share a link with your friends and if they register, both of you will <b>get reward 2
                            coins</b></p>
                        <button className={classNames(styles.copy, {[styles.copied]: copied})}
                                onClick={copyTextToClipboard}>{copied ? 'Copied' : 'Copy link to invite'}</button>
                        <div className={styles.promoCode}>
                            <span>Or generate promo code</span>
                            <input type="text" placeholder={"Name"} value={promoCode}
                                   onChange={handleInputChange(setPromoCode)}
                                   style={promoCodeAvailable ? {color: "#fff"} : {color: "red"}}/>
                        </div>
                        <p className={styles.progressCoins}>You invited <b>{user && user.invites} people</b> and
                            earned <b>{user && user.invites * 2} coins</b></p>
                    </div>
                    <div>
                        {user && user.isPartner ? (
                            <>
                                <h3>You are a partner of Send my Dream</h3>
                                <p>You invited <b>{user && user.invites} people</b> and
                                    earned <b>${partner && partner.totalEarned || "0"}</b></p>
                                <p>Balance: <b>${partner && partner.totalEarned || "0"}</b></p>
                                <Link href={"/account/referral/account"} className={styles.affiliate}
                                      onClick={copyTextToClipboard}>Affiliate account</Link>
                            </>
                        ) : (
                            <>
                                <h3>Invite 50 people and become a partner of Send my dream</h3>
                                <p>Our network partners receive real money. Receive up to 50% of payments from attracted
                                    clients</p>
                                <div className={styles.progress}>
                                    <span>Your progress</span>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressStep}
                                             style={{width: `${(user && user.invites / 50) * 100}%`}}></div>
                                    </div>
                                    <span>{user && user.invites}/50</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <button onClick={routeBack} className={styles.backLink}>Save and exit</button>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Referral);
