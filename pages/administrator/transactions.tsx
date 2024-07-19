import React, {useEffect, useState} from "react";
import Header from "../../components/Header/Header";
import AdministratorMenu, {handleEmail, handleExport} from "../../components/Menu/AdministratorMenu";
import {transactions} from "../../data/admin_menu";
import Link from "next/link";
import MobileMenu from "../../components/Menu/MobileMenu";
import withAuth from "../../components/HOC/withAuth";
import {getPayouts, getPurchases} from "../../utils/api";
import styles from "../../styles/Transactions.module.scss";
import {parse, isSameDay, isSameMonth} from "date-fns";
import Head from "next/head";

const Transactions: React.FC = () => {
    const [payouts, setPayouts] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        updateTransactions();
    }, []);

    useEffect(() => {
        setTableData(extractTableData());
    }, [payouts]);

    const updateTransactions = async () => {
        try {
            const data = await getPayouts();
            setPayouts(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const parseDate = (dateString) => {
        return parse(dateString, "dd/MM/yyyy HH:mm:ss", new Date());
    };

    const getCountForDay = (date) => {
        return payouts.filter(purchase => purchase.paymentDate ? isSameDay(parseDate(purchase.paymentDate), date) : {}).length;
    };

    const getCountForMonth = (date) => {
        return payouts.filter(purchase => purchase.paymentDate ? isSameMonth(parseDate(purchase.paymentDate), date) : {}).length;
    };

    const getTotalForDay = (date) => {
        return payouts
            .filter(purchase => purchase.paymentDate ? isSameDay(parseDate(purchase.paymentDate), date) : {})
            .reduce((total, purchase) => total + purchase.amount, 0);
    };

    const getTotalForMonth = (date) => {
        return payouts
            .filter(purchase => purchase.paymentDate ? isSameMonth(parseDate(purchase.paymentDate), date) : {})
            .reduce((total, purchase) => total + purchase.amount, 0);
    };

    const today = new Date();
    const totalForDay = getTotalForDay(today);
    const totalForMonth = getTotalForMonth(today);
    const countForDay = getCountForDay(today);
    const countForMonth = getCountForMonth(today);

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
        {buttonText: 'Export', type: handleExport},
    ];

    return (
        <div className={styles.transactions}>
            <Head>
                <title>Transactions</title>
            </Head>
            <Header/>
            <section>
                <h1>Administrator Settings</h1>
                <AdministratorMenu {...transactions} button={adminButtons} tableData={tableData}/>
                <div className={styles.border}>
                    <table>
                        <thead>
                        <tr>
                            <th className={`hide-on-mobile`}>User ID</th>
                            <th className={`hide-on-desktop`}>ID</th>
                            <th className={`hide-on-mobile`}>Country</th>
                            <th>Amount</th>
                            <th className={`hide-on-desktop`}>Date</th>
                            <th className={`hide-on-desktop`}>Country</th>
                            <th className={`hide-on-mobile`}>Date of payment</th>
                            <th className={`hide-on-mobile`}>E-mail</th>
                            <th className={`hide-on-mobile`}>Referral</th>
                        </tr>
                        </thead>
                        <tbody>
                        {payouts.map((purchase, index: React.Key) => (
                            <tr key={index}>
                                <td className={`hide-on-mobile`}>{purchase.partner.user.id}</td>
                                <td className={`hide-on-desktop`}>{purchase.partner.user.id}</td>
                                <td className={`hide-on-mobile`}>{purchase.country}</td>
                                <td>${purchase.amount}</td>
                                <td className={`hide-on-desktop`}>{purchase.paymentDate}</td>
                                <td className={`hide-on-desktop`}>{purchase.country}</td>
                                <td className={`hide-on-mobile`}>{purchase.paymentDate}</td>
                                <td className={`hide-on-mobile`}>{purchase.partner.email}</td>
                                <td className={`hide-on-mobile`}>{purchase.partner.id}</td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td className={`hide-on-mobile`}>
                                <b>Total in a day:</b> <br/>
                                {countForDay} <br/>
                                <b>Total in {today.toLocaleString('default', {month: 'long'})}:</b> <br/>
                                {countForMonth}
                            </td>
                            <td className={`hide-on-desktop`}>
                                <b>Day:</b> <br/>
                                {countForDay} <br/>
                                <b>{today.toLocaleString('default', {month: 'long'})}:</b> <br/>
                                {countForMonth}
                            </td>
                            <td className={`hide-on-mobile`}></td>
                            <td className={`hide-on-mobile`}>
                                <b>Total in a day:</b> <br/>
                                ${totalForDay} <br/>
                                <b>Total in {today.toLocaleString('default', {month: 'long'})}:</b> <br/>
                                ${totalForMonth}
                            </td>
                            <td className={`hide-on-desktop`}>
                                <b>Day:</b> <br/>
                                ${totalForDay} <br/>
                                <b>{today.toLocaleString('default', {month: 'long'})}:</b> <br/>
                                ${totalForMonth}
                            </td>
                            <td></td>
                            <td></td>
                            <td className={`hide-on-mobile`}></td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <button className={`${styles.exportButton} hide-on-desktop`}
                        onClick={() => handleExport(tableData)}>Export to excel
                </button>
            </section>
            <MobileMenu/>
        </div>
    );
};

export default withAuth(Transactions);
