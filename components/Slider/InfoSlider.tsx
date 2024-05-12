import styles from './InfoSlider.module.scss'
import Slider from "react-slick";
import React from "react";
import {Tab} from "../../utils/types";

const InfoMobile: React.FC = () => {

    const tabs: Tab[] = [
        {
            id: 1,
            title: 'How to use?',
            content:
                <div>
                    <p>Send my dream is an online platform that aims to help people achieve their goals. Our formula is
                        very simple - we help people find motivation to achieve their dreams. We don't make dreams come
                        true and we don't promise it. We only provide the opportunity to visualize your dream and fix
                        your goal.</p>
                    <p>This is the first and most important step towards its implementation.</p>
                    <p>The functionality of the application allows you to select a desire and send your request.</p>
                    <p>The wishes you send are only a concrete projection of your abstract thoughts.</p>
                    <p>We wish you good luck. Strive for your dreams and they will definitely come true!</p>
                    <p>Best regards, SMD team</p>
                </div>
        },
        {
            id: 2,
            title: 'How to use?',
            content:
                <div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat.</p>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur.</p>
                    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                        est laborum.</p>
                </div>
        },
        {
            id: 3,
            title: 'How to use?',
            content:
                <div>
                    <p>Send my dream is an online platform that aims to help people achieve their goals. Our formula is
                        very simple - we help people find motivation to achieve their dreams. We don't make dreams come
                        true and we don't promise it. We only provide the opportunity to visualize your dream and fix
                        your goal.</p>
                    <p>This is the first and most important step towards its implementation.</p>
                    <p>The functionality of the application allows you to select a desire and send your request.</p>
                    <p>The wishes you send are only a concrete projection of your abstract thoughts.</p>
                    <p>We wish you good luck. Strive for your dreams and they will definitely come true!</p>
                    <p>Best regards, SMD team</p>
                </div>
        },
    ]

    const settings = {
        dots: false,
        infinite: false,
        arrows: false,
        speed: 0,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: false
    };

    return (
        <div className={`slider hide-on-desktop`} style={{marginTop: "122px"}}>
            <Slider {...settings}>
                {tabs.map((tab, index:React.Key) => (
                    <div key={index} className={styles.content}>
                        <h3>{tab.title}</h3>
                        {tab.content}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default InfoMobile;
