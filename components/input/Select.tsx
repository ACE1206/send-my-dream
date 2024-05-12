import React, {useState} from 'react';
import styles from './Select.module.scss';
import {CategoryData} from "../../utils/types";
import Category from "../Category/Category";
import Image from "next/image";

interface CustomSelectProps {
    options: CategoryData[];
    placeholder?: CategoryData;
}

const CustomSelect: React.FC<CustomSelectProps> = ({options, placeholder}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<CategoryData | null>(null);

    const toggling = () => setIsOpen(!isOpen);

    const onOptionClicked = (option: CategoryData) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    return (
        <div className={styles.dropdown}>
            <div className={styles.dropdownHeader} onClick={toggling}>
                <Image src={selectedOption ? selectedOption.img : placeholder.img} alt="" width={30} height={30}/>
                <span>{selectedOption ? selectedOption.text : placeholder.text}</span>
            </div>
            {isOpen && (
                <div className={styles.dropdownListContainer}>
                    <div className={styles.dropdownList}>
                        {options.map((option, index: React.Key) => (
                            <Category key={index} {...option} chooseCategory={() => onOptionClicked(option)}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
