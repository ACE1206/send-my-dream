import styles from "../../styles/Account.module.scss"
import React, {useEffect, useState} from "react";
import Header from "../../components/Header/Header";
import Link from "next/link";
import Image from "next/image";
import ProfileCard from "../../components/BoutiqueCard/ProfileCard";
import {CardData, ModalProps} from "../../utils/types";
import BoutiqueCardModal from "../../components/BoutiqueCard/BoutiqueCardModal";
import MobileCarousel from "../../components/Slider/MobileCarousel";
import MobileMenu from "../../components/Menu/MobileMenu";
import InsufficientModal from "../../components/Modal/InsufficientModal";
import ShareModal from "../../components/Modal/ShareModal";
import withAuth from "../../components/HOC/withAuth";
import {getDreams, getUserData, getUserProducts} from "../../utils/api";
import {useRouter} from "next/router";

const Account: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<CardData | null>(null);
    const [dreams, setDreams] = useState<CardData[]>([]);
    const [profileCards, setProfileCards] = useState<CardData[]>(dreams.map(dream => ({
        ...dream,
        selected: false
    })));
    const selectedCards = profileCards.filter(dream => dream.selected);
    const [purchaseModalOpen, setPurchaseModalOpen] = useState<ModalProps>(null)
    const [user, setUser] = useState(null)

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
            const dreamsData = await getUserProducts("ADDED");
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

    const sendDreams = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        if (selectedCards.length > 0) {
            const totalPrice = selectedCards.reduce((acc, card) => acc + card.price, 0);
            if (totalPrice > user.balance) {
                setPurchaseModalOpen({totalPrice: totalPrice, balance: user.balance})
            }
            const cardsToSend = selectedCards.map(c => {
                return c.id
            })
            router.push({
                pathname: '/account/choose',
                query: {product: cardsToSend},
            })
        }

    }

    return (
        <div className={styles.account}>
            <Header/>
            <section>
                <h1>Personal account</h1>
                <div className={styles.info}>
                    <div className={styles.name}>
                        <Image src={user && user.avatar || "/images/account/profile-icon.png"} alt="" width={100}
                               height={100}/>
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
                        <Link href="/account/referral">Try</Link>
                    </div>
                    <div className={styles.clubCard}>
                        <Link href="/"><span>Club Card</span></Link>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h2>Dreamboard</h2>
                        <span>Waiting to be sent</span>
                        <Link href="/account/sent">Sent</Link>
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
                        {selectedProduct && <BoutiqueCardModal boutiqueProps={selectedProduct} canAdd={false}
                                                               onClose={() => setSelectedProduct(null)}/>}
                    </div>
                    <div className={styles.total}>
                        <span><b>Selected:</b> {selectedCards.length}</span>
                        <button onClick={clearSelections}></button>
                        <button type={"submit"} onClick={sendDreams}>Send dream(s)</button>
                    </div>
                </div>
                <div className={`${styles.mobileHeader} hide-on-desktop`}>
                    <h2>Dreamboard</h2>
                    <span>Waiting to be sent</span>
                    <button onClick={sendDreams}>Send</button>
                </div>
                {purchaseModalOpen &&
                    <InsufficientModal totalPrice={purchaseModalOpen.totalPrice} balance={user.balance}
                                       onClose={() => setPurchaseModalOpen(null)}/>}
                <MobileCarousel dreams={profileCards}/>
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Account)
