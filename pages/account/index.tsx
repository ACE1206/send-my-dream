import styles from "../../styles/Account.module.scss"
import React, {useState} from "react";
import Header from "../../components/Header/Header";
import Link from "next/link";
import Image from "next/image";
import {profile_cards} from "../../data/profile_cards";
import ProfileCard from "../../components/BoutiqueCard/ProfileCard";
import {CardData} from "../../utils/types";
import BoutiqueCardModal from "../../components/BoutiqueCard/BoutiqueCardModal";
import MobileCarousel from "../../components/Slider/MobileCarousel";
import MobileMenu from "../../components/Menu/MobileMenu";
import InsufficientModal from "../../components/Modal/InsufficientModal";
import ShareModal from "../../components/Modal/ShareModal";
import withAuth from "../../components/HOC/withAuth";

const Account: React.FC = () => {
    const [profileCards, setProfileCards] = useState<CardData[]>(profile_cards.map(card => ({
        ...card,
        selected: false
    })));
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);
    const selectedCount = profileCards.filter(card => card.selected).length;
    const [purchaseModalOpen, setPurchaseModalOpen] = useState(false)

    const handleSelect = (selected: boolean, index: number) => {
        const newCards = [...profileCards];
        newCards[index].selected = selected;
        setProfileCards(newCards);
    };

    const clearSelections = () => {
        const newCards = profileCards.map(card => ({...card, selected: false}));
        setProfileCards(newCards);
    };

    const openModal = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        setPurchaseModalOpen(true)
    }

    return (
        <div className={styles.account}>
            <Header/>
            <section>
                <h1>Personal account</h1>
                <div className={styles.info}>
                    <div className={styles.name}>
                        <Image src="/images/account/profile-icon.png" alt="" width={100} height={100}/>
                        <h3>John Smith</h3>
                        <Link href="/"></Link>
                    </div>
                    <div className={styles.balance}>
                        <Image src="/images/account/balance-icon.png" alt="" width={100} height={100}/>
                        <h3>Balance</h3>
                        <span>2000</span>
                        <Link href="/">+</Link>
                    </div>
                    <div className={styles.invite}>
                        <div>
                            <span>Invite friends</span>
                            <p>Reward of free coins.</p>
                        </div>
                        <Link href="/">Try</Link>
                    </div>
                    <div className={styles.clubCard}>
                        <Link href="/"><span>Club Card</span></Link>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h2>Dreamboard</h2>
                        <span>Waiting to be sent</span>
                        <Link href="/">Sent</Link>
                    </div>
                    <div className={styles.cards}>
                        {profileCards.map((card, index) => (
                            <ProfileCard
                                key={index}
                                {...card}
                                openModal={() => setSelectedProduct(card)}
                                onSelect={(selected) => handleSelect(selected, index)}
                                isSelected={card.selected}
                            />
                        ))}
                        {selectedProduct && <BoutiqueCardModal boutiqueProps={selectedProduct}
                                                               onClose={() => setSelectedProduct(null)}/>}
                    </div>
                    <div className={styles.total}>
                        <span><b>Selected:</b> {selectedCount}</span>
                        <button onClick={clearSelections}></button>
                        <Link onClick={openModal} href="/">Send dream(s)</Link>
                    </div>
                </div>
                <div className={`${styles.mobileHeader} hide-on-desktop`}>
                    <h2>Dreamboard</h2>
                    <span>Waiting to be sent</span>
                    <Link onClick={openModal} href="/">Send</Link>
                </div>
                {purchaseModalOpen && <InsufficientModal onClose={() => setPurchaseModalOpen(false)}/>}
                <MobileCarousel dreams={profile_cards}/>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Account)
