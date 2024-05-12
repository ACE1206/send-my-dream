import styles from "./Category.module.scss"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {CategoryData} from "../../utils/types";

type CategoryProps = CategoryData & {
    chooseCategory: () => void;
};

const Category:React.FC<CategoryProps> = ({link, img, text, alt, chooseCategory}) => {
    return (
        <button className={styles.category} onClick={chooseCategory}>
            <Image src={img} alt={alt} width={42} height={42}/>
            <span>{text}</span>
        </button>
    )
};

export default Category;
