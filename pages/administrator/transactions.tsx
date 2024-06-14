import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import AdministratorMenu from "../../components/Menu/AdministratorMenu";
import { transactions } from "../../data/admin_menu";
import Link from "next/link";
import MobileMenu from "../../components/Menu/MobileMenu";
import withAuth from "../../components/HOC/withAuth";
import { getPurchases } from "../../utils/api";
import styles from "../../styles/Transactions.module.scss";
import { parse, isSameDay, isSameMonth } from "date-fns";

const Transactions: React.FC = () => {
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        updateTransactions();
    }, []);

    const updateTransactions = async () => {
        try {
            const data = await getPurchases();
            setPurchases(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    const parseDate = (dateString) => {
        return parse(dateString, "dd/MM/yyyy HH:mm:ss", new Date());
    };

    const getCountForDay = (date) => {
        return purchases.filter(purchase => isSameDay(parseDate(purchase.purchaseDate), date)).length;
    };

    const getCountForMonth = (date) => {
        return purchases.filter(purchase => isSameMonth(parseDate(purchase.purchaseDate), date)).length;
    };

    const getTotalForDay = (date) => {
        return purchases
            .filter(purchase => isSameDay(parseDate(purchase.purchaseDate), date))
            .reduce((total, purchase) => total + purchase.purchaseValue, 0);
    };

    const getTotalForMonth = (date) => {
        return purchases
            .filter(purchase => isSameMonth(parseDate(purchase.purchaseDate), date))
            .reduce((total, purchase) => total + purchase.purchaseValue, 0);
    };

    const today = new Date();
    const totalForDay = getTotalForDay(today);
    const totalForMonth = getTotalForMonth(today);
    const countForDay = getCountForDay(today);
    const countForMonth = getCountForMonth(today);

    return (
        <div className={styles.transactions}>
            <Header />
            <section>
                <h1>Administrator Settings</h1>
                <AdministratorMenu {...transactions} />
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
                    {purchases.map((purchase, index: React.Key) => (
                        <tr key={index}>
                            <td className={`hide-on-mobile`}>{purchase.user.id}</td>
                            <td className={`hide-on-desktop`}>{purchase.user.id}</td>
                            <td className={`hide-on-mobile`}>{purchase.user.country}</td>
                            <td>{purchase.purchaseValue}</td>
                            <td className={`hide-on-desktop`}>{purchase.purchaseDate}</td>
                            <td className={`hide-on-desktop`}>{purchase.user.country}</td>
                            <td className={`hide-on-mobile`}>{purchase.purchaseDate}</td>
                            <td className={`hide-on-mobile`}>{purchase.user.email}</td>
                            <td className={`hide-on-mobile`}>{purchase.user.isPartner ? "Yes" : "No"}</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td className={`hide-on-mobile`}>
                            <b>Total in a day:</b> <br />
                            {countForDay} <br />
                            <b>Total in {today.toLocaleString('default', { month: 'long' })}:</b> <br />
                            {countForMonth}
                        </td>
                        <td className={`hide-on-desktop`}>
                            <b>Day:</b> <br />
                            {countForDay} <br />
                            <b>{today.toLocaleString('default', { month: 'long' })}:</b> <br />
                            {countForMonth}
                        </td>
                        <td className={`hide-on-mobile`}></td>
                        <td className={`hide-on-mobile`}>
                            <b>Total in a day:</b> <br />
                            ${totalForDay} <br />
                            <b>Total in {today.toLocaleString('default', { month: 'long' })}:</b> <br />
                            ${totalForMonth}
                        </td>
                        <td className={`hide-on-desktop`}>
                            <b>Day:</b> <br />
                            ${totalForDay} <br />
                            <b>{today.toLocaleString('default', { month: 'long' })}:</b> <br />
                            ${totalForMonth}
                        </td>
                        <td></td>
                        <td></td>
                        <td className={`hide-on-mobile`}></td>
                    </tr>
                    </tfoot>
                </table>
                <Link className={`${styles.exportButton} hide-on-desktop`} href="/">Export to excel</Link>
            </section>
            <MobileMenu />
        </div>
    );
};

export default withAuth(Transactions);
