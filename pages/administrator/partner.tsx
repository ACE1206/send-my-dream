import styles from '../../styles/Partner.module.scss'
import React, {useState} from "react";
import Header from "../../components/Header/Header";
import AdministratorMenu from "../../components/Menu/AdministratorMenu";
import {partner} from "../../data/admin_menu";
import partnerList from "../../data/partner.json";
import PartnerModal from "../../components/Modal/PartnerModal";
import Link from "next/link";
import MobileMenu from "../../components/Menu/MobileMenu";

const Partner: React.FC = () => {
    const elements = Array.from({length: 5}, () => partnerList[0]);
    const [selectedUser, setSelectedUser] = useState(null)

    return (
        <div className={styles.partner}>
            <Header/>
            <section>
                <h1>Administrator Settings</h1>
                <AdministratorMenu {...partner} />
                <table>
                    <thead>
                    <tr>
                        <th className={`hide-on-mobile`}>User ID</th>
                        <th className={`hide-on-desktop`}>Name and id</th>
                        <th className={`hide-on-mobile`}>%</th>
                        <th className={`hide-on-mobile`}>E-mail</th>
                        <th>Must be paid</th>
                        <th>Earned all the time</th>
                        <th className={`hide-on-mobile`}>Invoice for payment</th>
                        <th className={`hide-on-mobile`}>Pay system</th>
                        <th className={`hide-on-mobile`}></th>
                    </tr>
                    </thead>
                    <tbody>
                    {elements.map((e, index:React.Key) => (
                        <tr key={index} onClick={() => setSelectedUser(e)}>
                            <td className={`hide-on-mobile`}>ID: {e.user_id}</td>
                            <td className={`hide-on-desktop`}>{e.name}<br/>id{e.user_id}</td>
                            <td className={`hide-on-mobile`}>{e.name}</td>
                            <td className={`hide-on-mobile`}>{e.percent}</td>
                            <td className={`hide-on-mobile`}>{e.email}</td>
                            <td>${e.must_be_paid}</td>
                            <td>${e.earned}</td>
                            <td className={`hide-on-mobile`}>{e.invoice}</td>
                            <td className={`hide-on-mobile`}>{e.pay_system}</td>
                            <td className={`hide-on-mobile`}><button>Pay</button></td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>Quantity: {elements.length}</td>
                        <td className={`hide-on-mobile`}></td>
                        <td className={`hide-on-mobile`}></td>
                        <td className={`hide-on-mobile`}></td>
                        <td>${elements.reduce((acc, num) => acc + num.must_be_paid, 0)}</td>
                        <td>${elements.reduce((acc, num) => acc + num.earned, 0).toFixed(2)}</td>
                        <td className={`hide-on-mobile`}></td>
                        <td className={`hide-on-mobile`}></td>
                        <td className={`hide-on-mobile`}></td>
                    </tr>
                    </tfoot>
                </table>
                {selectedUser && <PartnerModal {...selectedUser} onClose={() => setSelectedUser(null)}/>}
                <Link className={`${styles.exportButton} hide-on-desktop`} href="/">Export to excel</Link>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default Partner
