// Меню администратора

import React, {useState} from "react";
import {AdminMenuProps} from "../../utils/types";
import Link from "next/link";
import styles from './AdminstratorMenu.module.scss';
import * as XLSX from 'xlsx';
import {sendEmail} from "../../utils/api";

// Экспорт таблицы
export const handleExport = (tableData) => {

    const now = new Date();
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.aoa_to_sheet(tableData);

    const columnWidths = tableData[0].map(() => ({wch: 15})); // Устанавливаем ширину в 15 символов для каждого столбца
    ws['!cols'] = columnWidths;

    const rowHeights = tableData.map(() => ({hpt: 20}));
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

// Отправка email
export const handleEmail = async (tableData: any) => {
    try {
        await sendEmail(tableData)
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

const AdministratorMenu: React.FC<AdminMenuProps & { tableData?: any }> = ({link, button, tableData}) => {
    const [buttonTexts, setButtonTexts] = useState<string[]>(button ? button.map((item) => item.buttonText) : null);

    // Изменение текста для нажатия кнопки
    const handleButtonClick = (index: number, action: (data: any) => void) => {
        const newTexts = [...buttonTexts];
        newTexts[index] = 'Done';
        setButtonTexts(newTexts);

        setTimeout(() => {
            setButtonTexts((prevTexts) => {
                const resetTexts = [...prevTexts];
                resetTexts[index] = button[index].buttonText;
                return resetTexts;
            });
        }, 3000);

        action(tableData);
    };

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
                    {button.map((item, index) => (
                        <button key={index}
                                onClick={() => handleButtonClick(index, item.type)}>{buttonTexts[index]}
                        </button>
                    ))}
                </div>
            }
        </div>
    )
}

export default AdministratorMenu;
