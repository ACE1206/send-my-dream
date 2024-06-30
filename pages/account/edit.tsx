import styles from "../../styles/AccountEdit.module.scss";
import React, {useEffect, useState} from "react";
import Header from "../../components/Header/Header";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "../../components/Menu/MobileMenu";
import withAuth from "../../components/HOC/withAuth";
import {editUser, getUserData} from "../../utils/api";
import {useRouter} from "next/router";
import Head from "next/head";

const Edit: React.FC = () => {
    const [user, setUser] = useState<{
        id: number,
        username: string,
        email: string,
        avatar: string,
        balance: number
    } | null>(null);
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [gender, setGender] = useState<string>("Male");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("/images/account/avatar.png");

    const router = useRouter()

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            previewFile(file);
            setAvatar(file);
        } else {
            setAvatar(null);
        }
    };

    const previewFile = (file: File) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setImagePreview(reader.result);
            }
        };
    };

    useEffect(() => {
        const updateUser = async () => {
            const fetchUser = await getUserData();
            setUser(fetchUser);
            setUsername(fetchUser.username);
            setEmail(fetchUser.email);
            if (fetchUser.avatar) {
                setImagePreview(fetchUser.avatar);
            }
        };
        updateUser();
    }, []);

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: any) => {
        setter(e.target.value);
    };

    const saveChanges = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("id", user.id.toString())
        formData.append("username", username)
        formData.append("email", email)
        if (avatar) {
            formData.append("avatar", avatar)
        }
        formData.append("gender", gender)
        const response = await editUser(formData)
        if (response.status === 200) {
            router.push('/account')
        }
    }

    return (
        <div className={styles.profile}>
            <Head>
                <title>Edit Account</title>
            </Head>
            <Header/>
            <section className={styles.container}>
                <div className={styles.content}>
                    <h1>Personal account</h1>
                    <div className={styles.info}>
                        <div className={styles.name}>
                            <Image src={imagePreview} alt="" width={100} height={100}/>
                            {user && <h3>{user.username}</h3>}
                        </div>
                        <div className={styles.balance}>
                            <Image src="/images/account/balance-icon.png" alt="" width={100} height={100}/>
                            <h3>Balance</h3>
                            {user && <span>{user.balance}</span>}
                            <Link href="/account/store">+</Link>
                        </div>
                    </div>
                    <div className={styles.edit}>
                        <form id="userUpdateForm">
                            <label>
                                How can we call you?
                                <input type="text" placeholder="How can we call you?" value={username}
                                       onChange={handleInputChange(setUsername)}/>
                            </label>
                            <label>
                                What is your gender?
                                <div>
                                    <select name="gender" onChange={handleInputChange(setGender)}>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    <div className={styles.selectArrow}>∨</div>
                                </div>
                            </label>
                            <label>
                                E-mail
                                <input type="text" placeholder="Your email" value={email}
                                       onChange={handleInputChange(setEmail)}/>
                            </label>
                        </form>
                        <div className={styles.avatar}>
                            <label htmlFor="fileInput" className={styles.customButton}>
                                <Image src={imagePreview} alt="" width={350} height={350}/>
                            </label>
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={styles.fileInput}
                            />
                        </div>
                    </div>
                </div>
                <input type="submit" form="userUpdateForm" value="Save changes" onClick={saveChanges}/>
            </section>
            <MobileMenu/>
        </div>
    );
};

export default withAuth(Edit);
