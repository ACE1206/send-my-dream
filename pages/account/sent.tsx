import styles from "../../styles/Account.module.scss"
import React, {useEffect, useState} from "react";
import Header from "../../components/Header/Header";
import Link from "next/link";
import Image from "next/image";
import ProfileCard from "../../components/BoutiqueCard/ProfileCard";
import {CardData} from "../../utils/types";
import BoutiqueCardModal from "../../components/BoutiqueCard/BoutiqueCardModal";
import MobileCarousel from "../../components/Slider/MobileCarousel";
import MobileMenu from "../../components/Menu/MobileMenu";
import InsufficientModal from "../../components/Modal/InsufficientModal";
import ShareModal from "../../components/Modal/ShareModal";
import withAuth from "../../components/HOC/withAuth";
import {generateLink, getDreams, getUserData, getUserProducts} from "../../utils/api";
import GenerateLink from "../../components/Generation/GenerateLink";
import Head from "next/head";
import {useRouter} from "next/router";

const Sent: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);
    const [dreams, setDreams] = useState<CardData[]>([]);
    const [profileCards, setProfileCards] = useState<CardData[]>(dreams.map(dream => ({
        ...dream,
        selected: false
    })));
    const [user, setUser] = useState(null)
    const [sharedProduct, setSharedProduct] = useState<number>(null)

    const router = useRouter()

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

    const handleShare = async (imagePath: number) => {
        setSelectedProduct(null)
        const response = await generateLink(imagePath)
        router.push(`${window.location.origin}/account/api/download-image/${response.uniqueId}`);
        // setSharedProduct(imagePath)
    }

    return (
        <div className={styles.account}>
            <Head>
                <title>Sent Dreams</title>
            </Head>
            <Header/>
            <section className={styles.content}>
                <h1>Personal account</h1>
                <div className={styles.info}>
                    <Link href={"/account/edit"} className={styles.name}>
                        <Image src={user && user.avatar || "/images/account/profile-icon.png"} alt="" width={100}
                               height={100}/>
                        {user && <h3>{user.username}</h3>}
                        <Link href="/account/edit"></Link>
                    </Link>
                    <Link href={"/account/store"} className={styles.balance}>
                        <Image src="/images/account/balance-icon.png" alt="" width={100} height={100}/>
                        <h3>Balance</h3>
                        {user && <span>{user.balance}</span>}
                        <Link href="/account/store">+</Link>
                    </Link>
                    <Link href={"/account/referral"} className={styles.invite}>
                        <div>
                            <span>Invite friends</span>
                            <p>Reward of free coins.</p>
                        </div>
                        <Link href="/account/referral">Try</Link>
                    </Link>
                    <Link href={"/"} className={styles.clubCard}>
                        <Link href="/" onClick={e => e.preventDefault()}><span>Club Card</span></Link>
                    </Link>
                </div>
                <div className={styles.contentData}>
                    <div className={styles.header}>
                        <Link href="/account/">To be sent</Link>
                        <h2>Sent Dreams</h2>
                        <span>Sent</span>
                    </div>
                    <div className={styles.cards}>
                        {[...profileCards].sort((a, b) => b.id - a.id).map((card, index) => (
                            <ProfileCard
                                checkboxAvailable={false}
                                key={index}
                                {...card}
                                category={card.category}
                                openModal={() => setSelectedProduct(card)}
                                onSelect={(selected) => handleSelect(selected, index)}
                                isSelected={card.selected}
                                share={(path) => handleShare(path)}
                                availableToShare={true}
                            />
                        ))}
                        {selectedProduct && <BoutiqueCardModal boutiqueProps={selectedProduct} availableToAdd={false}
                                                               availableToShare={true} share={(path) => handleShare(path)}
                                                               onClose={() => setSelectedProduct(null)}/>}
                        {sharedProduct &&
                            <GenerateLink id={sharedProduct} onClose={() => setSharedProduct(null)}/>
                        }
                    </div>
                    <div className={`${styles.total} hide-on-mobile`}>
                        <span><b>Sent:</b> {profileCards.length}</span>
                        <Link href="/account/">Choose dreams</Link>
                    </div>
                </div>
                <div className={`${styles.mobileHeader} hide-on-desktop`}>
                    <Link href={"/account/"}>To be sent</Link>
                    <h2>Sent</h2>
                    <span>Sent</span>
                </div>
                <MobileCarousel checkboxAvailable={false} dreams={[...profileCards].sort((a, b) => b.id - a.id)} availableToSare={true}/>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Sent)
