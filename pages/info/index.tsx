import styles from "../../styles/Info.module.scss"
import React from "react";
import Header from "../../components/Header/Header";
import Tabs from "../../components/Tabs/Tabs";
import InfoMobile from "../../components/Slider/InfoSlider";
import MobileMenu from "../../components/Menu/MobileMenu";

const Info:React.FC = () => {
    return(
        <div className={styles.info}>
            <Header/>
            <section>
                <h1>Information</h1>
                <Tabs/>
                <InfoMobile/>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default Info
