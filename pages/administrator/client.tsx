import React, {useEffect, useState} from "react";
import Header from "../../components/Header/Header";
import AdministratorMenu, {handleEmail, handleExport} from "../../components/Menu/AdministratorMenu";
import {partner} from "../../data/admin_menu";
import partnerList from "../../data/partner.json";
import PartnerModal from "../../components/Modal/PartnerModal";
import UserModal from "../../components/Modal/UserModal";
import Link from "next/link";
import MobileMenu from "../../components/Menu/MobileMenu";
import {getUsers} from "../../utils/api";
import withAuth from "../../components/HOC/withAuth";
import Head from "next/head";
import styles from '../../styles/Client.module.scss';

const Client: React.FC = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        updateUsersList();
    }, []);

    useEffect(() => {
        setTableData(extractTableData());
    }, [users]);

    const updateUsersList = async () => {
        try {
            const usersData = await getUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const extractTableData = () => {
        const table = document.querySelector('table');
        if (!tableData) {
            console.error("Table not found");
            return [];
        }

        const data = [];

        const headers = table.querySelectorAll('thead tr');
        headers.forEach(header => {
            const cells = header.querySelectorAll('th:not(.hide-on-desktop)');
            const headerData = [];
            cells.forEach(cell => {
                headerData.push(cell.textContent);
            });
            data.push(headerData);
        });

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td:not(.hide-on-desktop)');
            const rowData = [];
            cells.forEach(cell => {
                rowData.push(cell.textContent);
            });
            data.push(rowData);
        });

        const footers = table.querySelectorAll('tfoot tr');
        footers.forEach(footer => {
            const cells = footer.querySelectorAll('td:not(.hide-on-desktop)');
            const footerData = [];
            cells.forEach(cell => {
                footerData.push(cell.textContent);
            });
            data.push(footerData);
        });

        return data;
    };

    const adminButtons = [
        { buttonText: 'Export', type: handleExport },
        { buttonText: 'Send Email', type: handleEmail }
    ];

    return (
        <div className={styles.client}>
            <Head>
                <title>Clients</title>
            </Head>
            <Header/>
            <section>
                <h1>Administrator Settings</h1>
                <AdministratorMenu {...partner} tableData={tableData} button={adminButtons} />
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
                                <td className={`hide-on-mobile`}>{e.email}</td>
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
                <button className={`${styles.exportButton} hide-on-desktop`} onClick={() => handleExport(tableData)}>Export to excel</button>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Client);
