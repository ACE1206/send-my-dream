import { useEffect, useState } from 'react';

interface LocalStorageState {
    image: string;
    animation: string;
}

export const useLocalStorage = (initialValue: string) => {
    const [storedValue, setStoredValue] = useState<string>(() => {
        try {
            const item = window.localStorage.getItem('background_animation');
            return item ? item : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue = (value: LocalStorageState) => {
        try {
            setStoredValue(value.animation);
            window.localStorage.setItem('image', value.image);
            window.localStorage.setItem('animation', value.animation);
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const item = window.localStorage.getItem('background_animation');
            if (item !== storedValue) {
                setStoredValue(item ? item : initialValue);
            }
        };

        const image = window.localStorage.getItem("background_image");
        document.documentElement.style.setProperty('--background-image', `url(${image ? image : "/earth-background.png"})`);

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [storedValue, initialValue]);

    return [storedValue, setValue] as const;
};

export default useLocalStorage;
