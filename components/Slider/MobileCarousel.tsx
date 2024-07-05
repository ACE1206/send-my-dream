import styles from './MobileCarousel.module.scss';
import Slider from "react-slick";
import React, { useEffect, useState } from "react";
import BoutiqueCard from "../../components/BoutiqueCard/BoutiqueCard";
import { CardData } from "../../utils/types";
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
    onSelect?: (selected: any, key: any) => void,
    checkboxAvailable?: boolean,
    availableToSare?: boolean,
    loading?: boolean,
    onChange?: (id: number | null, uuid: string) => void
}> = ({
          cards,
          dreams,
          onSelect,
          checkboxAvailable = true,
          availableToSare = false,
          loading = false,
          onChange
      }) => {
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);
    const [sharedProduct, setSharedProduct] = useState<number | null>(null);
    const [cardsToShow, setCardsToShow] = useState<CardData[]>([]);

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
        setCardsToShow(cards || []);
    }, [cards]);

    return (
        <div className={`${styles.carouselContainer} hide-on-desktop`}>
            <Slider {...settings}>
                {cardsToShow.length === 0 ? (
                    cards ? cards.map((card, index) => (
                        <div key={index} className={styles.slickSlide}>
                            <BoutiqueCard {...card} openModal={() => setSelectedProduct(card)} />
                        </div>
                    )) : dreams.map((dream, index) => (
                        <div key={index} className={styles.slickSlide}>
                            <ProfileCard checkboxAvailable={checkboxAvailable} onSelect={(selected) => onSelect(selected, index)} key={index} {...dream} openModal={() => setSelectedProduct(dream)} />
                        </div>
                    ))
                ) : (
                    cardsToShow.map((card, index) => (
                        <div key={index} className={styles.slickSlide}>
                            <BoutiqueCard {...card} openModal={() => setSelectedProduct(card)} onChange={(id, isInBasket) => onChange(id, card.uuid)} />
                        </div>
                    ))
                )}
                {loading && <LoadingCard />}
            </Slider>
            {selectedProduct && selectedProduct.video &&
                <MeditationModal {...selectedProduct} onClose={() => setSelectedProduct(null)} />}
            {selectedProduct &&
                <BoutiqueCardModal availableToAdd={!dreams} boutiqueProps={selectedProduct} onClose={() => setSelectedProduct(null)} availableToShare={availableToSare} share={(path) => handleShare(path)} onChange={(id, isInBasket) => onChange(id, selectedProduct.uuid)} />}
            {sharedProduct &&
                <GenerateLink id={sharedProduct} onClose={() => setSharedProduct(null)} />}
        </div>
    );
};

export default MobileCarousel;
