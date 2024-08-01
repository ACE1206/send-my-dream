import styles from './MotivationCarousel.module.scss'
import Slider from "react-slick";
import React from "react";
import {Quote} from "../../utils/types";

interface MotivationCarouselProps {
    quotes: Quote[];
}

const MobileCarousel: React.FC<MotivationCarouselProps> = ({quotes}) => {

    const settings = {
        dots: false,
        infinite: false,
        arrows: false,
        speed: 0,
        slidesToShow: 1,
        slidesToScroll: 1,
        fixed: false
    };

    return (
        <div className={`quotes slider hide-on-desktop`} style={{margin:"0 10px"}}>
            <Slider {...settings}>
                {quotes.map((quote, index:React.Key) => (
                    <div className={styles.container} key={index}>
                        <p className={styles.author}>{quote.author}</p>
                        <p className={styles.quote}>{quote.text}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default MobileCarousel;
