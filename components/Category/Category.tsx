import styles from "./Category.module.scss"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {CategoryData} from "../../utils/types";

type CategoryProps = CategoryData & {
    chooseCategory: () => void;
};

const Category:React.FC<CategoryProps> = ({image, title, chooseCategory}) => {
    return (
        <button className={styles.category} onClick={chooseCategory}>
            <Image src={image ? image : ""} alt={title} width={42} height={42} fetchPriority={"high"}/>
            <span>{title}</span>
        </button>
    )
};

export default Category;
