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
import {deleteProductsFromBasket, getDreams, getUserData, getUserProducts} from "../../utils/api";
import {useRouter} from "next/router";
import Head from "next/head";
import {useCart} from "../../components/Basket/CartProvider";

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

    const { removeProductFromCart } = useCart();
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
            const updatedDreamsData = dreamsData.map(dream => ({ ...dream, selected: false }));
            setProfileCards(updatedDreamsData);
        } catch (error) {
            console.error("Failed to fetch dreams:", error);
        }
    };

    const handleSelect = (selected: boolean, id: number) => {
        const newCards = profileCards.map(card => card.id === id ? { ...card, selected } : card);
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
            } else {
                const cardsToSend = selectedCards.map(c => {
                    return c.id
                })
                router.push({
                    pathname: '/account/choose',
                    query: {product: cardsToSend},
                })
            }
        }
    }

    const handleDeletion = async () => {
        const cardsToDelete = selectedCards.map(c => {
            return c.id
        })
        await deleteProductsFromBasket(cardsToDelete).then(() => updateDreamList())
        removeProductFromCart(cardsToDelete.length)
        updateDreamList()
    }

    useEffect(() => {
    }, [profileCards]);

    return (
        <div className={styles.account}>
            <Head>
                <title>Account</title>
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
                    <Link href={"/"} className={styles.clubCard} style={{boxShadow: "none"}}>
                        <Link href="/"><span>Club Card</span></Link>
                    </Link>
                </div>

                <div className={`${styles.mobileHeader} hide-on-desktop`}>
                    <span>To be sent</span>
                    <h2>Dreams</h2>
                    <Link href={"/account/sent"}>Sent</Link>
                </div>

                <MobileCarousel dreams={[...profileCards].reverse()} onSelect={(selected, index) => handleSelect(selected, index)}/>
                <div className={styles.contentData}>
                    <div className={styles.header}>
                        <span>To be sent</span>
                        <h2>Dreams</h2>
                        <Link href="/account/sent">Sent</Link>
                    </div>
                    <div className={styles.cards}>
                        {[...profileCards].reverse().map((card, index) => (
                            <ProfileCard
                                key={index}
                                {...card}
                                category={card.category}
                                openModal={() => setSelectedProduct(card)}
                                onSelect={(selected) => handleSelect(selected, card.id)}
                                isSelected={card.selected}
                            />
                        ))}
                        {selectedProduct && <BoutiqueCardModal boutiqueProps={selectedProduct} availableToAdd={false}
                                                               onClose={() => setSelectedProduct(null)}/>}
                    </div>
                    <div className={styles.total}>
                        <span><b>Selected:</b> {selectedCards.length}</span>
                        <button disabled={selectedCards.length <= 0} onClick={handleDeletion}></button>
                        <button type={"submit"} onClick={sendDreams}>Send dream(s)</button>
                    </div>
                </div>
                {purchaseModalOpen &&
                    <InsufficientModal totalPrice={purchaseModalOpen.totalPrice} balance={user.balance}
                                       onClose={() => setPurchaseModalOpen(null)}/>}
            </section>
            <MobileMenu/>
        </div>
    )
}

export default withAuth(Account)
