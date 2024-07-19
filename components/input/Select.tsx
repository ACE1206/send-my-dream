import React, { useState } from 'react';
import styles from './Select.module.scss';
import { CategoryData } from "../../utils/types";
import Image from "next/image";
import Category from "../Category/Category";

interface CustomSelectProps {
    options: CategoryData[];
    placeholder: CategoryData;
    onSelect: (category: CategoryData) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, placeholder, onSelect}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<CategoryData | null>(options[0] || null);

    const toggling = () => setIsOpen(!isOpen);

    const onOptionClicked = (option: CategoryData) => {
        setSelectedOption(option);
        setIsOpen(false);
        onSelect(option); // Notify parent component about the selection
    };

    return (
        <div className={styles.dropdown}>
            <div className={styles.dropdownHeader} onClick={toggling}>
                <Image src={selectedOption ? selectedOption.image : placeholder.image} alt="" width={30} height={30} />
                <span>{selectedOption ? selectedOption.name : placeholder.name}</span>
            </div>
            {isOpen && (
                <div className={styles.dropdownListContainer}>
                    <div className={styles.dropdownList}>
                        {options.map((option, index: React.Key) => (
                            // <div key={index} onClick={() => onOptionClicked(option)} className={styles.dropdownItem}>
                            //     {option.name}
                            // </div>
                            <Category {...option} chooseCategory={() => onOptionClicked(option)} isSelected={selectedOption?.id === option.id}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
