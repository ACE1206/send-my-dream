import React from "react";

export type IconProps = {
    link: string;
    img: string;
    alt: string;
};

export type CategoryData = {
    id?: number;
    image: string;
    title: string;
}

export type CardData = {
    id?: number;
    dream_image: string;
    dream_category?: number;
    category?: string,
    video?: string,
    title: string;
    description: string;
    cost: number;
    selected?: boolean;
    status?: boolean;
}

export type CardProps = CardData & {
    openModal: (boutiqueCard: CardData) => void;
};

export type ModalProps = {
    boutiqueProps?: CardData;
    onClose: () => void;
}

export type CreateProps = {
    id?: number;
    name?: string;
    description?: string;
    cost?: number;
    image?: string;
    onClose: () => void;
    updateList?: () => void;
}

export type Quote = {
    text: string;
    author: string;
};

export type MeditationData = {
    img: string;
    video: string,
    text: string;
    alt: string;
    description: string;
    cost: number;
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
