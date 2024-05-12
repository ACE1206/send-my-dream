import styles from '../../styles/Client.module.scss'
import React, {useState} from "react";
import Header from "../../components/Header/Header";
import AdministratorMenu from "../../components/Menu/AdministratorMenu";
import {partner} from "../../data/admin_menu";
import partnerList from "../../data/partner.json";
import PartnerModal from "../../components/Modal/PartnerModal";
import UserModal from "../../components/Modal/UserModal";
import Link from "next/link";
import MobileMenu from "../../components/Menu/MobileMenu";

const Client: React.FC = () => {
    const elements = Array.from({length: 5}, () => partnerList[0]);
    const [selectedUser, setSelectedUser] = useState(null)

    return (
        <div className={styles.client}>
            <Header/>
            <section>
                <h1>Administrator Settings</h1>
                <AdministratorMenu {...partner} />
                <table>
                    <thead>
                    <tr>
                        <th className={`hide-on-mobile`}>User ID</th>
                        <th className={`hide-on-desktop`}>ID</th>
                        <th className={`hide-on-mobile`}>Country</th>
                        <th className={`hide-on-mobile`}>Balance</th>
                        <th className={`hide-on-mobile`}>Total payment</th>
                        <th className={`hide-on-desktop`}>Payment</th>
                        <th className={`hide-on-mobile`}>E-mail</th>
                        <th>Referral</th>
                        <th className={`hide-on-mobile`}>Registration date</th>
                        <th className={`hide-on-desktop`}>Country</th>
                    </tr>
                    </thead>
                    <tbody>
                    {elements.map((e, index:React.Key) => (
                        <tr key={index} onClick={() => setSelectedUser(e)}>
                            <td className={`hide-on-mobile`}>ID: {e.user_id}</td>
                            <td className={`hide-on-desktop`}>id{e.user_id}</td>
                            <td className={`hide-on-mobile`}>{e.country}</td>
                            <td className={`hide-on-mobile`}>{e.balance}</td>
                            <td>{e.earned}</td>
                            <td className={`hide-on-mobile`}>${e.email}</td>
                            <td>${e.referral}</td>
                            <td className={`hide-on-mobile`}>{e.created_at}</td>
                            <td className={`hide-on-desktop`}>{e.country}</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td className={`hide-on-mobile`}></td>
                        <td className={`hide-on-mobile`}></td>
                        <td>Total ${elements.reduce((acc, num) => acc + num.balance, 0)}</td>
                        <td>Total ${elements.reduce((acc, num) => acc + num.earned, 0)}</td>
                        <td></td>
                        <td></td>
                        <td className={`hide-on-mobile`}></td>
                    </tr>
                    </tfoot>
                </table>
                {selectedUser && <UserModal {...selectedUser} onClose={() => setSelectedUser(null)}/>}
                <Link className={`${styles.exportButton} hide-on-desktop`} href="/">Export to excel</Link>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default Client
