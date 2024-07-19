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
    const [sid, setSid] = useState<string | null>(null);

    useEffect(() => {
        const socket = io(GLOBAL_URL, {
            timeout: 60000,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            transports: ['websocket']
        });

        socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        socket.on('audio', (data) => {
            setSid(data.data);
            if (audioRef.current) {
                console.log('Audio event received, setting source and loading audio');
                audioRef.current.src = `${GLOBAL_URL}/sound/sound/${data.data}`;
                audioRef.current.load(); // Загрузить новый источник
                audioRef.current.oncanplaythrough = () => {
                    console.log('Audio can play through');
                    if (isPlaying) {
                        audioRef.current?.play();
                    }
                };
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

    useEffect(() => {
        if (audioRef.current) {
            const handleEnded = () => {
                audioRef.current!.currentTime = 0;
                audioRef.current!.play();
            };

            audioRef.current.addEventListener('ended', handleEnded);

            return () => {
                audioRef.current!.removeEventListener('ended', handleEnded);
            };
        }
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isPlaying, setIsPlaying }}>
            <audio ref={audioRef}></audio>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
