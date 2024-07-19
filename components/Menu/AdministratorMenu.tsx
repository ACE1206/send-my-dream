import React from "react";
import {AdminMenuProps} from "../../utils/types";
import Link from "next/link";
import styles from './AdminstratorMenu.module.scss';
import * as XLSX from 'xlsx';
import {sendEmail} from "../../utils/api";

export const handleExport = (tableData) => {
    const now = new Date();
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.aoa_to_sheet(tableData);

    const columnWidths = tableData[0].map(() => ({wch: 15})); // Устанавливаем ширину в 15 символов для каждого столбца
    ws['!cols'] = columnWidths;

    const rowHeights = tableData.map(() => ({hpt: 20})); // Устанавливаем высоту в 20 пунктов для каждой строки
    ws['!rows'] = rowHeights;

    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_address = {c: C, r: R};
            const cell_ref = XLSX.utils.encode_cell(cell_address);
            if (!ws[cell_ref]) continue;
            if (!ws[cell_ref].s) ws[cell_ref].s = {};
            ws[cell_ref].s.border = {
                top: {style: "thin", color: {rgb: "000000"}},
                bottom: {style: "thin", color: {rgb: "000000"}},
                left: {style: "thin", color: {rgb: "000000"}},
                right: {style: "thin", color: {rgb: "000000"}}
            };
        }
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Table Data');

    XLSX.writeFile(wb, `data_${now}.xlsx`);
};

export const handleEmail = async (tableData: any) => {
    try {
        await sendEmail(tableData)
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const AdministratorMenu: React.FC<AdminMenuProps & { tableData?: any }> = ({link, button, tableData}) => {

    return (
        <div className={styles.menu}>
            <div className={styles.items}>
                {link.map((item, index: React.Key) => (
                    <Link key={index} className={item.linkText === 'Moderation' ? `hide-on-mobile` : ''}
                          href={item.linkUrl}>{item.linkText}</Link>
                ))}
            </div>
            {button &&
                <div className={`${styles.buttons} hide-on-mobile`}>
                    {button.map((item, index: React.Key) => (
                        <button key={index} onClick={() => item.type(tableData)}>{item.buttonText}</button>
                    ))}
                </div>
            }
        </div>
    )
}

export default AdministratorMenu;
