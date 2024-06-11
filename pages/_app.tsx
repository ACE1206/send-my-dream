import type {AppProps} from 'next/app'
import '../styles/global.scss'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {AuthProvider} from "../components/Auth/AuthContext";
import {SocketProvider} from "../components/Socket/SocketProvider";

export default function App({Component, pageProps}: AppProps) {
    return (
        <SocketProvider>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </SocketProvider>
    )
}
