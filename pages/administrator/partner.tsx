import styles from '../../styles/Partner.module.scss'
import React, {useEffect, useState} from "react";
import Header from "../../components/Header/Header";
import AdministratorMenu, {handleEmail, handleExport} from "../../components/Menu/AdministratorMenu";
import {partner} from "../../data/admin_menu";
import PartnerModal from "../../components/Modal/PartnerModal";
import MobileMenu from "../../components/Menu/MobileMenu";
import withAuth from "../../components/HOC/withAuth";
import {checkPayout, getPartners} from "../../utils/api";
import Head from "next/head";

const Partner: React.FC = () => {
    const [partners, setPartners] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        updatePartners()
    }, [])

    useEffect(() => {
        setTableData(extractTableData());
    }, [partners]);

    const checkPayment = async (id: number) => {
        return checkPayout(id)
    }

    const updatePartners = async () => {
        const data = await getPartners();
        setPartners(data)
    }

    useEffect(() => {
        updatePartners()
    }, [selectedUser]);const extractTableData = () => {
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
        <div className={styles.partner}>
            <Head>
                <title>Partners</title>
            </Head>
            <Header/>
            <section>
                <h1>Administrator Settings</h1>
                <AdministratorMenu {...partner} button={adminButtons} tableData={tableData} />
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
                                <td className={`hide-on-mobile`}>{e.profitPercentage}</td>
                                <td className={`hide-on-mobile`}>{e.email}</td>
                                <td>${e.mustBePaid}</td>
                                <td>${e.totalEarned}</td>
                                <td className={`hide-on-mobile`}>{e.user.id}</td>
                                <td className={`hide-on-mobile`}>Paypal</td>
                                <td className={`hide-on-mobile`}>
                                    {checkPayment(e.id) ? (
                                        ""
                                    ) : (
                                        <button>Pay</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td>Quantity: {partners.length}</td>
                            <td className={`hide-on-mobile`}></td>
                            <td className={`hide-on-mobile`}></td>
                            <td>${partners.reduce((acc, num) => acc + num.mustBePaid, 0)}</td>
                            <td>${partners.reduce((acc, num) => acc + num.totalEarned, 0)}</td>
                            <td className={`hide-on-mobile`}></td>
                            <td className={`hide-on-mobile`}></td>
                            <td className={`hide-on-mobile`}></td>
                            <td className={`hide-on-mobile`}></td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                {selectedUser && <PartnerModal {...selectedUser} onClose={() => setSelectedUser(null)}/>}
                <button className={`${styles.exportButton} hide-on-desktop`} onClick={() => handleExport(tableData)}>Export to excel</button>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Partner)
