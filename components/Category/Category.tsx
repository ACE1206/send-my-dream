// Категория

import styles from "./Category.module.scss";
import React from "react";
import Image from "next/image";
import { CategoryData } from "../../utils/types";

type CategoryProps = CategoryData & {
    chooseCategory: () => void;
    isSelected?: boolean;
};

const Category: React.FC<CategoryProps> = ({ image, name, chooseCategory, isSelected }) => {
    return (
        <button
            className={`${styles.category} ${isSelected ? styles.selected : ''}`}
            onClick={chooseCategory}
        >
            <Image src={image ? image : ""} alt={name} width={60} height={60} fetchPriority="high" loading={"lazy"}/>
            <span>{name}</span>
        </button>
    );
};

export default Category;
