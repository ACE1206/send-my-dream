import styles from '../../styles/Partner.module.scss'
import React, {useEffect, useState} from "react";
import Header from "../../components/Header/Header";
import AdministratorMenu from "../../components/Menu/AdministratorMenu";
import {partner} from "../../data/admin_menu";
import partnerList from "../../data/partner.json";
import PartnerModal from "../../components/Modal/PartnerModal";
import Link from "next/link";
import MobileMenu from "../../components/Menu/MobileMenu";
import withAuth from "../../components/HOC/withAuth";
import {getPartners} from "../../utils/api";

const Partner: React.FC = () => {
    const [partners, setPartners] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)

    useEffect(() => {
        updatePartners()
    }, [])

    const updatePartners = async () => {
        const data = await getPartners();
        setPartners(data)
    }

    return (
        <div className={styles.partner}>
            <Header/>
            <section>
                <h1>Administrator Settings</h1>
                <AdministratorMenu {...partner} />
                <div className={styles.border}>
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
                        {partners.map((e, index: React.Key) => (
                            <tr key={index} onClick={() => setSelectedUser(e)}>
                                <td className={`hide-on-mobile`}>ID: {e.user.id}</td>
                                <td className={`hide-on-desktop`}>{e.name}<br/>id{e.user.id}</td>
                                <td className={`hide-on-mobile`}>{e.name}</td>
                                <td className={`hide-on-mobile`}>{e.profitPercentage}</td>
                                <td className={`hide-on-mobile`}>{e.email}</td>
                                <td>${e.mustBePaid}</td>
                                <td>${e.totalEarned}</td>
                                <td className={`hide-on-mobile`}>{e.user.id}</td>
                                <td className={`hide-on-mobile`}>Paypal</td>
                                <td className={`hide-on-mobile`}>
                                    <button>Pay</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td>Quantity: {partners.length}</td>
                            <td className={`hide-on-mobile`}></td>
                            <td className={`hide-on-mobile`}></td>
                            <td className={`hide-on-mobile`}></td>
                            <td>${partners.reduce((acc, num) => acc + num.mustBePaid, 0)}</td>
                            <td>${partners.reduce((acc, num) => acc + num.totalEarned, 0)}</td>
                            <td className={`hide-on-mobile`}></td>
                            <td className={`hide-on-mobile`}></td>
                            <td className={`hide-on-mobile`}></td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                {selectedUser && <PartnerModal {...selectedUser} onClose={() => setSelectedUser(null)}/>}
                <Link className={`${styles.exportButton} hide-on-desktop`} href="/">Export to excel</Link>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Partner)
