import styles from './MobileCarousel.module.scss'
import Slider from "react-slick";
import React, {useState} from "react";
import BoutiqueCard from "../../components/BoutiqueCard/BoutiqueCard";
import {CardData} from "../../utils/types";
import BoutiqueCardModal from "../BoutiqueCard/BoutiqueCardModal";
import MeditationModal from "../../components/Modal/PurchaseModal";
import ProfileCard from "../BoutiqueCard/ProfileCard";

interface MobileCarouselProps {
    cards?: CardData[];
    dreams?: CardData[];
}

const MobileCarousel: React.FC<MobileCarouselProps & {onSelect?: (selected: any, key: any) => void, checkboxAvailable?: boolean}> = ({cards, dreams, onSelect, checkboxAvailable = true}) => {
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);

    const settings = {
        dots: false,
        infinite: false,
        arrows: false,
        speed: 0,
        slidesToShow: 2,
        slidesToScroll: 1,
        adaptiveHeight: false
    };

    return (
        <div className={`${styles.carouselContainer} hide-on-desktop`}>
            <Slider {...settings}>
                {cards ? cards.map((card, index) => (
                    <BoutiqueCard key={index} {...card} openModal={() => setSelectedProduct(card)}/>
                )) : dreams.map((dream, index) => (
                    <ProfileCard checkboxAvailable={checkboxAvailable} onSelect={(selected) => onSelect(selected, index)} key={index} {...dream} openModal={() => setSelectedProduct(dream)}/>
                ))}
            </Slider>
            {selectedProduct && selectedProduct.video &&
                <MeditationModal {...selectedProduct} onClose={() => setSelectedProduct(null)}/>}
            {selectedProduct &&
                <BoutiqueCardModal availableToAdd={!dreams} boutiqueProps={selectedProduct} onClose={() => setSelectedProduct(null)}/>}
        </div>
    );
};

export default MobileCarousel;
