// Вкладки информационной страницы на desktop

import React, {useState} from 'react';
import {Tab} from '../../utils/types';
import styles from './Tabs.module.scss';

const Tabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number>(1);


    const tabs: Tab[] = [
        {
            id: 1,
            title: 'About project',
            content:
                <div>
                    <p>
                        Send my dream is an online platform that aims to help people with achieving their goals. Our
                        formula is very simple - we help people find the motivation to achieve their dreams. We don't
                        fulfill dreams and we don't promise it. We only provide the opportunity to visualize your dream
                        and fix your goal. This is the first and most important step on the way to its
                        fulfillment. <br/><br/>

                        The functionality of the app allows you to choose a wish and send your request. <br/><br/>

                        The wishes you send are only a concrete projection of your abstract thoughts. <br/><br/>

                        We wish you good luck. Strive for your dreams, work hard to realize them and believe in yourself
                        and your success! <br/><br/>

                        Sincerely, the SMD team
                    </p>
                </div>
        },
        {
            id: 2,
            title: 'About us',
            content:
                <div>
                    <p>
                        Send my dream is an entertainment and motivational project. We make no guarantees about the
                        fulfillment of your wishes, nor do we promise to give you what is depicted in the product
                        libraries.<br/><br/>

                        We only help you to create a visual image of your wishes to encourage you to realize them.<br/><br/>

                        We are not responsible for their realization, nor do we make promises or mislead you.<br/><br/>

                        Sincerely, SMD team
                    </p>
                </div>
        },
        {
            id: 3,
            title: 'How to use?',
            content:
                <div>
                    <p>
                        In order to make a wish, you need to follow 3 simple steps.<br/><br/>

                        1) Select wishes and add them to your profile. You can do this in two ways - choose a ready-made
                        solution from the wish Boutique OR generate a visualization using AI. Once you have selected the
                        appropriate options, click on the blue plus in the bottom right corner of the card and add it to
                        your profile.<br/><br/>

                        2) In the profile, under the "Waiting to send" tab you can see the selected wishes" Next, by
                        selecting one or more of them, you create a selection and send it for submission.<br/><br/>

                        3) After that, you need to replenish your game currency balance, if you haven't done it yet, and
                        go through the final steps of sending.
                    </p>
                </div>
        },
    ]


    return (
        <div className={`${styles.tabsContainer} hide-on-mobile`}>
            <div className={styles.tabTitles}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={tab.id === activeTab ? styles.active : ''}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>
            <div className={styles.tabContent}>
                <h3>{tabs.find(tab => tab.id === activeTab)?.title}</h3>
                {tabs.find(tab => tab.id === activeTab)?.content}
            </div>
        </div>
    );
};

export default Tabs;
