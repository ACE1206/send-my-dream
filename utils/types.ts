import React from "react";

export type IconProps = {
    link: string;
    img: string;
    alt: string;
};

export type CategoryData = {
    id?: number;
    image: string;
    name: string;
}

export type CardData = {
    id?: number;
    image: string;
    video?: string,
    name: string;
    description: string;
    price: number;
    selected?: boolean;
    status?: boolean;
    category?: CategoryData;
}

export type CardProps = CardData & {
    openModal: (boutiqueCard: CardData) => void;
};

export type ModalProps = {
    boutiqueProps?: CardData;
    totalPrice?: number;
    balance?: number;
    canAdd?: boolean
    onClose?: () => void;
}

export type CreateProps = {
    id?: number;
    name?: string;
    description?: string;
    cost?: number;
    image?: string;
    onClose: () => void;
    updateList?: () => void;
    category?: CategoryData;
}

export type Quote = {
    text: string;
    author: string;
};

export type MeditationData = {
    image: string;
    video: string,
    name: string;
    alt: string;
    description: string;
    price: number;
}

export interface Tab {
    id: number;
    title: string;
    content: React.ReactElement;
}

export type DreamData = {
    date: string;
    img: string;
    author: string;
    avatar: string;
    text: string;
    description: string;
}

type AdminLink = {
    linkText: string;
    linkUrl: string;
}

type AdminButton = {
    buttonText: string;
    buttonUrl: string;
}

export type AdminMenuProps = {
    link: AdminLink[];
    button?: AdminButton[];
}

export type Backgrounds = {
    preview: string;
    animation: string;
    alt: string;
}
