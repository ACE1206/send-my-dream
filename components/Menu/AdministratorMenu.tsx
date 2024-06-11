import styles from './AdminstratorMenu.module.scss'
import React from "react";
import {AdminMenuProps} from "../../utils/types";
import Link from "next/link";

const AdministratorMenu: React.FC<AdminMenuProps> = ({link, button}) => {
    return (
        <div className={styles.menu}>
            <div className={styles.items}>
                {link.map((item, index: React.Key) => (
                    <Link key={index} className={item.linkText === 'Moderation' ? `hide-on-mobile` : ''} href={item.linkUrl}>{item.linkText}</Link>
                ))}
            </div>
            {button &&
                <div className={`${styles.buttons} hide-on-mobile`}>
                    {button.map((item, index: React.Key) => (
                        <Link key={index} href={item.buttonUrl}>{item.buttonText}</Link>
                    ))}
                </div>
            }
        </div>
    )
}

export default AdministratorMenu
