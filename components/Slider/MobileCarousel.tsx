import styles from './MobileCarousel.module.scss';
import Slider from "react-slick";
import React, {useEffect, useState} from "react";
import BoutiqueCard from "../../components/BoutiqueCard/BoutiqueCard";
import {CardData} from "../../utils/types";
import BoutiqueCardModal from "../BoutiqueCard/BoutiqueCardModal";
import MeditationModal from "../../components/Modal/PurchaseModal";
import ProfileCard from "../BoutiqueCard/ProfileCard";
import GenerateLink from "../Generation/GenerateLink";
import LoadingCard from "../BoutiqueCard/LoadingCard";

interface MobileCarouselProps {
    cards?: CardData[];
    dreams?: CardData[];
}

const MobileCarousel: React.FC<MobileCarouselProps & {
    onSelect?: (selected: any, key: number) => void,
    checkboxAvailable?: boolean,
    availableToSare?: boolean,
    loading?: boolean,
    onChange?: (id: number | null, uuid: string) => void
    registerCheckIfExists?: (checkFunction: () => void) => void
}> = ({
          cards,
          dreams,
          onSelect,
          checkboxAvailable = true,
          availableToSare = false,
          loading = false,
                                onChange,
          registerCheckIfExists
      }) => {
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);
    const [sharedProduct, setSharedProduct] = useState<number | null>(null);
    const [cardsToShow, setCardsToShow] = useState<CardData[]>([]);
    const [dreamsToShow, setDreamsToShow] = useState<CardData[]>([]);
    const settings = {
        dots: false,
        infinite: false,
        arrows: false,
        speed: 0,
        slidesToShow: 2,
        slidesToScroll: 1,
        adaptiveHeight: false
    };

    const handleShare = (imagePath: number) => {
        setSelectedProduct(null);
        setSharedProduct(imagePath);
    }

    useEffect(() => {
        setDreamsToShow(dreams || [])
    }, [dreams]);

    useEffect(() => {
        setCardsToShow(cards || [])
    }, [cards]);

    return (
        <div className={`${styles.carouselContainer} hide-on-desktop`}>
            <Slider {...settings}>
                {loading && <LoadingCard/>}
                {cardsToShow.length === 0 ? (
                    cards ? cards.map((card, index) => (
                        <div key={index} className={styles.slickSlide}>
                            <BoutiqueCard registerCheckIfExists={registerCheckIfExists} card={card} openModal={() => setSelectedProduct(card)}
                                          onChange={(id, isInBasket) => onChange(id, card.uuid)}/>
                        </div>
                    )) : dreamsToShow.map((dream, index) => (
                        <div key={index} className={styles.slickSlide}>
                            <ProfileCard checkboxAvailable={checkboxAvailable} isSelected={dream.selected}
                                         onSelect={(selected) => onSelect(selected, dream.id)} key={index} {...dream}
                                         openModal={() => setSelectedProduct(dream)}/>
                        </div>
                    ))
                ) : (
                    [...cardsToShow].reverse().map((card, index) => (
                        <div key={index} className={styles.slickSlide}>
                            <BoutiqueCard registerCheckIfExists={registerCheckIfExists} card={card} openModal={() => setSelectedProduct(card)}
                                          onChange={(id, isInBasket) => onChange(id, card.uuid)}/>
                        </div>
                    ))
                )}
            </Slider>
            {selectedProduct && selectedProduct.video &&
                <MeditationModal {...selectedProduct} onClose={() => setSelectedProduct(null)}/>}
            {selectedProduct &&
                <BoutiqueCardModal availableToAdd={!dreams} boutiqueProps={selectedProduct}
                                   onClose={() => setSelectedProduct(null)} availableToShare={availableToSare}
                                   share={(path) => handleShare(path)}
                                   onChange={(id, uuid) => onChange(id, uuid)} />}
            {sharedProduct &&
                <GenerateLink id={sharedProduct} onClose={() => setSharedProduct(null)}/>}
        </div>
    );
};

export default MobileCarousel;
