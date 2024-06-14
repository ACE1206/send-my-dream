import styles from '../../styles/Transactions.module.scss'
import React from "react";
import Header from "../../components/Header/Header";
import AdministratorMenu from "../../components/Menu/AdministratorMenu";
import {transactions} from "../../data/admin_menu";
import Link from "next/link";
import MobileMenu from "../../components/Menu/MobileMenu";
import withAuth from "../../components/HOC/withAuth";

const Transactions: React.FC = () => {
    return (
        <div className={styles.transactions}>
            <Header/>
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
                    <tr>
                        <td className={`hide-on-mobile`}></td>
                        <td className={`hide-on-mobile`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className={`hide-on-mobile`}></td>
                        <td className={`hide-on-mobile`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className={`hide-on-mobile`}></td>
                        <td className={`hide-on-mobile`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td className={`hide-on-mobile`}></td>
                        <td className={`hide-on-mobile`}></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td className={`hide-on-mobile`}>
                            <b>Total in a day:</b> <br/>
                            100 <br/>
                            <b>Total in a April:</b> <br/>
                            1000
                        </td>
                        <td className={`hide-on-desktop`}>
                            <b>Day:</b> <br/>
                            100 <br/>
                            <b>April:</b> <br/>
                            1000
                        </td>
                        <td className={`hide-on-mobile`}></td>
                        <td className={`hide-on-mobile`}>
                            <b>Total in a day:</b> <br/>
                            $500 <br/>
                            <b>Total in a April:</b> <br/>
                            $10 000
                        </td>
                        <td className={`hide-on-desktop`}>
                            <b>Day:</b> <br/>
                            $100 <br/>
                            <b>April:</b> <br/>
                            $10 000
                        </td>
                        <td></td>
                        <td></td>
                        <td className={`hide-on-mobile`}></td>
                    </tr>
                    </tfoot>
                </table>
                <Link className={`${styles.exportButton} hide-on-desktop`} href="/">Export to excel</Link>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Transactions)
