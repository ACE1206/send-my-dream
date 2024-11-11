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
            {user ? (
                    <>
                        <section className={styles.content}>
                            <h1>Account</h1>
                            <div className={styles.info}>
                                <Link href={"/account/edit"} className={styles.name}>
                                    <Image src={user && user.avatar || "/images/account/profile-icon.webp"} alt=""
                                           width={100}
                                           height={100}/>
                                    {user && <h3>{user.username}</h3>}
                                    <Link href="/account/edit"></Link>
                                </Link>
                                <Link href={"/account/store"} className={styles.balance}>
                                    <Image src="/images/account/balance-icon.webp" alt="" width={100} height={100}/>
                                    <h3>Balance</h3>
                                    {user && <span>{user.balance}</span>}
                                    <Link href="/account/store">+</Link>
                                </Link>
                                <Link href={"/account"} className={styles.nav}>
                                    <h3>Wishlist</h3>
                                    <Image src={'/images/shooting_star.svg'} alt={''} width={100} height={100}/>
                                </Link>
                                <Link href={"/account/sent"} className={styles.nav}>
                                    <h3>Sent</h3>
                                    <Image src={'/images/stars.svg'} alt={''} width={100} height={100}/>
                                </Link>
                            </div>
                            <div className={styles.contentData}>
                                <div className={styles.header}>
                                    <h2>Dreams</h2>
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
                                    {selectedProduct &&
                                        <BoutiqueCardModal boutiqueProps={selectedProduct} availableToAdd={false}
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
                                <h2>Dreams</h2>
                            </div>
                            <MobileCarousel checkboxAvailable={false} dreams={[...profileCards].sort((a, b) => b.id - a.id)}
                                            availableToSare={true}/>
                        </section>
                        <MobileMenu/>
                    </>
                ) :
                (
                    <div>Loading...</div>
                )
            }
        </div>
    )
}

export default withAuth(Sent)
