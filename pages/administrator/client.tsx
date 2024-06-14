import styles from '../../styles/Client.module.scss'
import React, {useEffect, useState} from "react";
import Header from "../../components/Header/Header";
import AdministratorMenu from "../../components/Menu/AdministratorMenu";
import {partner} from "../../data/admin_menu";
import partnerList from "../../data/partner.json";
import PartnerModal from "../../components/Modal/PartnerModal";
import UserModal from "../../components/Modal/UserModal";
import Link from "next/link";
import MobileMenu from "../../components/Menu/MobileMenu";
import {getDreams, getUsers} from "../../utils/api";
import withAuth from "../../components/HOC/withAuth";

const Client: React.FC = () => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)

    useEffect(() => {
        updateUsersList()
    }, []);

    const updateUsersList = async () => {
        try {
            const usersData = await getUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    return (
        <div className={styles.client}>
            <Header/>
            <section>
                <h1>Administrator Settings</h1>
                <AdministratorMenu {...partner} />
                <div className={styles.border}>
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
                        {users.map((e, index: React.Key) => (
                            <tr key={index} onClick={() => setSelectedUser(e)}>
                                <td className={`hide-on-mobile`}>ID: {e.id}</td>
                                <td className={`hide-on-desktop`}>id{e.id}</td>
                                <td className={`hide-on-mobile`}>{e.country}</td>
                                <td className={`hide-on-mobile`}>{e.balance}</td>
                                <td>{e.totalPayment}</td>
                                <td className={`hide-on-mobile`}>${e.email}</td>
                                <td>{e.isPartner ? "Yes" : "No"}</td>
                                <td className={`hide-on-mobile`}>{e.createdAt}</td>
                                <td className={`hide-on-desktop`}>{e.country}</td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td>Quantity {users.length}</td>
                            <td className={`hide-on-mobile`}></td>
                            <td>Total ${users.reduce((acc, num) => acc + num.balance, 0)}</td>
                            <td>Total ${users.reduce((acc, num) => acc + num.totalPayment, 0)}</td>
                            <td className={`hide-on-mobile`}></td>
                            <td></td>
                            <td className={`hide-on-mobile`}></td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                {selectedUser && <UserModal {...selectedUser} onClose={() => setSelectedUser(null)}/>}
                <Link className={`${styles.exportButton} hide-on-desktop`} href="/">Export to excel</Link>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Client)
