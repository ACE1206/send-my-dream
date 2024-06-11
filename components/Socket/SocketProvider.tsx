import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<{ socket: Socket | null, isPlaying: boolean, setIsPlaying: (playing: boolean) => void }>({
    socket: null,
    isPlaying: false,
    setIsPlaying: () => {}
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const socketRef = useRef<Socket | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const socket = io('https://space-link.online', {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        socket.on('audio', () => {
            if (audioRef.current) {
                audioRef.current.src = `https://space-link.online/sound`;
                audioRef.current.load(); // Загрузить новый источник
            }
        });

        socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isPlaying, setIsPlaying }}>
            <audio ref={audioRef}></audio>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
