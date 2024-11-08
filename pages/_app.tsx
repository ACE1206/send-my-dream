import type {AppProps} from 'next/app'
import '../styles/global.scss'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {AuthProvider} from "../components/Auth/AuthContext";
import {SocketProvider} from "../components/Socket/SocketProvider";
import Head from "next/head";
import React from "react";
import {CartProvider} from "../components/Basket/CartProvider";
// import {AuthModalProvider} from "../components/Auth/AuthModalContext";
import '../global';

export default function App({Component, pageProps}: AppProps) {
    return (
        <SocketProvider>
            {/*<AuthModalProvider>*/}
                <AuthProvider>
                    <CartProvider>
                        <Head>
                            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                            <link rel="manifest" href="/site.webmanifest"/>
                            <meta name="msapplication-TileColor" content="#da532c"/>
                            <meta name="theme-color" content="#ffffff"/>
                            <meta name="viewport" content="width=device-width, initial-scale=1"/>
                            {/*<script src="https://cdn.jsdelivr.net/npm/eruda"></script>*/}
                            {/*<script>eruda.init();</script>*/}
                        </Head>
                        <Component {...pageProps} />
                    </CartProvider>
                </AuthProvider>
            {/*</AuthModalProvider>*/}
        </SocketProvider>
    )
}
