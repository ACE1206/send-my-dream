import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import styles from './PaymentInfo.module.scss';
import {checkIfRequestedPayment, createPayout} from "../../utils/api";

const CountrySelectDropdown: React.FC<{ onClose: () => void, partnerId: number, amount: number }> = ({
                                                                                                         onClose,
                                                                                                         partnerId,
                                                                                                         amount
                                                                                                     }) => {
    const [countries, setCountries] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({
        name: {common: 'United States'},
        flags: {png: 'https://flagcdn.com/w320/us.png'}
    })
    const [countrySelected, setCountrySelected] = useState(false)
    const [paymentSelected, setPaymentSelected] = useState(false)
    const [infoExists, setInfoExists] = useState(false)
    const [headerText, setHeaderText] = useState('Choose your country')
    const [buttonText, setButtonText] = useState('Next step')
    const [selectedPayment, setSelectedPayment] = useState(null)
    const [cardNumberOrEmail, setCardNumberOrEmail] = useState('')
    const [finished, setFinished] = useState(false)
    const [requested, setRequested] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
    };

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all');
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        const checkIfRequested = async () => {
            const response = await checkIfRequestedPayment(partnerId);
            setRequested(response)
        }
        checkIfRequested().then(() => setLoaded(true))
        fetchCountries();
    }, []);

    const handleSelectCountry = (country) => {
        setSelectedCountry(country);
        setIsOpen(false);
    };

    const handleSubmit = async () => {
        if (selectedCountry && !selectedPayment && !cardNumberOrEmail && !finished) {
            setCountrySelected(true);
            setHeaderText("Choose payment system")
        } else if (selectedCountry && selectedPayment && !cardNumberOrEmail && !finished) {
            setPaymentSelected(true)
            setHeaderText("Enter the transfer funds and counts to")
            setButtonText("Finish")
        } else if (selectedCountry && selectedPayment && cardNumberOrEmail && !finished) {
            await createPayout(cardNumberOrEmail, amount, selectedCountry.name.common, partnerId, selectedPayment)
            setInfoExists(true)
            setHeaderText("")
            setButtonText("Confirm")
            setFinished(true)
        }
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {loaded &&
                    <>
                        {requested ? (
                            <h2>You have already request reward</h2>
                        ) : (
                            <>
                                {amount >= 100 ? (
                                    <>
                                        <h2>Fill in the payment information</h2>
                                        <h3>{headerText}</h3>
                                        {!countrySelected && !paymentSelected && !infoExists &&
                                            <div className={styles.dropdown}>
                                                <div className={styles.dropdownHeader}
                                                     onClick={() => setIsOpen(!isOpen)}>
                                                    <Image src={selectedCountry.flags.png}
                                                           alt={`${selectedCountry.name.common} flag`}
                                                           width={30}
                                                           height={20}/>
                                                    <span>{selectedCountry.name.common}</span>
                                                    <span className={styles.arrow}>&#9662;</span>
                                                </div>
                                                {isOpen && (
                                                    <ul className={styles.dropdownList}>
                                                        {countries.map((country, index) => (
                                                            <li key={index} className={styles.dropdownItem}
                                                                onClick={() => handleSelectCountry(country)}>
                                                                <Image src={country.flags.png}
                                                                       alt={`${country.name.common} flag`}
                                                                       width={30}
                                                                       height={20}/>
                                                                <span>{country.name.common}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        }
                                        {countrySelected && !paymentSelected && !infoExists &&
                                            <div className={styles.paymentSelect}>
                                                <button className={selectedPayment === "PayPal" ? styles.selected : ``}
                                                        onClick={() => setSelectedPayment("PayPal")}>PayPal
                                                </button>
                                                <button
                                                    className={selectedPayment === "YooKassa" ? styles.selected : ``}
                                                    onClick={() => setSelectedPayment("YooKassa")}>YooKassa
                                                </button>
                                            </div>
                                        }
                                        {countrySelected && paymentSelected && !infoExists &&
                                            <label className={styles.paymentInfo}>
                                                <Image src={"/images/card.svg"} alt={''} width={50} height={50}/>
                                                <input type="text" value={cardNumberOrEmail}
                                                       onChange={handleInputChange(setCardNumberOrEmail)}/>
                                            </label>
                                        }
                                        {countrySelected && paymentSelected && infoExists &&
                                            <p className={styles.success}>
                                                The data has been transferred to the system. Your request is being
                                                processed.
                                                The
                                                partner reward
                                                is paid once a month after overcoming the reward amount of $ 100
                                            </p>
                                        }
                                        <button className={styles.next}
                                                onClick={finished ? onClose : handleSubmit}>{buttonText}</button>
                                    </>
                                ) : (
                                    <h2>You have to overcome the reward amount of $ 100 to request the reward.</h2>
                                )}
                            </>
                        )}
                    </>
                }
            </div>
        </div>
    );
};

export default CountrySelectDropdown;
