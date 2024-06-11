import styles from "../../styles/Account.module.scss"
import React, {useEffect, useState} from "react";
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
import {getDreams, getUserData, getUserProducts} from "../../utils/api";

const Sent: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);
    const [dreams, setDreams] = useState<CardData[]>([]);
    const [profileCards, setProfileCards] = useState<CardData[]>(dreams.map(dream => ({
        ...dream,
        selected: false
    })));
    const [user, setUser] = useState(null)

    useEffect(() => {
        updateUser()
        updateDreamList()
    }, []);

    const updateUser = async () => {
        const fetchUser = await getUserData();
        setUser(fetchUser)
    }

    const updateDreamList = async () => {
        try {
            const dreamsData = await getUserProducts("PURCHASED");
            setProfileCards(dreamsData);
        } catch (error) {
            console.error("Failed to fetch dreams:", error);
        }
    };

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
    }

    return (
        <div className={styles.account}>
            <Header/>
            <section>
                <h1>Personal account</h1>
                <div className={styles.info}>
                    <div className={styles.name}>
                        <Image src="/images/account/profile-icon.png" alt="" width={100} height={100}/>
                        {user && <h3>{user.username}</h3>}
                        <Link href="/account/edit"></Link>
                    </div>
                    <div className={styles.balance}>
                        <Image src="/images/account/balance-icon.png" alt="" width={100} height={100}/>
                        <h3>Balance</h3>
                        {user && <span>{user.balance}</span>}
                        <Link href="/account/store">+</Link>
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
                        <Link href="/account/">Waiting to be sent</Link>
                        <span>Sent</span>
                    </div>
                    <div className={styles.cards}>
                        {profileCards.map((card, index) => (
                            <ProfileCard
                                key={index}
                                {...card}
                                category={card.category}
                                openModal={() => setSelectedProduct(card)}
                                onSelect={(selected) => handleSelect(selected, index)}
                                isSelected={card.selected}
                            />
                        ))}
                        {selectedProduct && <BoutiqueCardModal boutiqueProps={selectedProduct}
                                                               onClose={() => setSelectedProduct(null)}/>}
                    </div>
                    <div className={styles.total}>
                        <span><b>Sent:</b> {profileCards.length}</span>
                        <Link href="/account/">Choose dreams</Link>
                    </div>
                </div>
                <div className={`${styles.mobileHeader} hide-on-desktop`}>
                    <h2>Dreamboard</h2>
                    <span>Waiting to be sent</span>
                    <Link onClick={openModal} href="/">Send</Link>
                </div>
                <MobileCarousel dreams={profile_cards}/>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Sent)
