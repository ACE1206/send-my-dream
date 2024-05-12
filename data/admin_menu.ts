import {AdminMenuProps} from "../utils/types";

export const content: AdminMenuProps = {
    link: [
        {
            linkText: 'Transactions',
            linkUrl: '/administrator/transactions'
        },
        {
            linkText: 'Users',
            linkUrl: '/administrator/client'
        },
        {
            linkText: 'Partners',
            linkUrl: '/administrator/partner'
        },
        {
            linkText: 'Content',
            linkUrl: '/administrator'
        },
        {
            linkText: 'Moderation',
            linkUrl: '/administrator/moderation'
        },
    ]
}

export const transactions: AdminMenuProps = {
    link: [
        {
            linkText: 'Transactions',
            linkUrl: '/administrator/transactions'
        },
        {
            linkText: 'Users',
            linkUrl: '/administrator/client'
        },
        {
            linkText: 'Partners',
            linkUrl: '/administrator/partner'
        },
        {
            linkText: 'Content',
            linkUrl: '/administrator'
        },
        {
            linkText: 'Moderation',
            linkUrl: '/administrator/moderation'
        },
    ],
    button: [
        {
            buttonText: 'Export to Excel',
            buttonUrl: '/'
        }
    ]
}

export const partner: AdminMenuProps = {
    link: [
        {
            linkText: 'Transactions',
            linkUrl: '/administrator/transactions'
        },
        {
            linkText: 'Users',
            linkUrl: '/administrator/client'
        },
        {
            linkText: 'Partners',
            linkUrl: '/administrator/partner'
        },
        {
            linkText: 'Content',
            linkUrl: '/administrator'
        },
    ],
    button: [
        {
            buttonText: 'E-mail newsletter',
            buttonUrl: '/'
        },
        {
            buttonText: 'Export to Excel',
            buttonUrl: '/'
        }
    ]
}
