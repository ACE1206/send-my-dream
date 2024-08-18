// Взаимодействие с websocket (трансляция музыки)

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
            if (audioRef.current) {
                console.log('Audio event received, setting source and loading audio');
                audioRef.current.src = `${GLOBAL_URL}/sound/sound/${data.data}`;
                audioRef.current.load();
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
        const handleEnded = () => {
            if (socketRef.current) {
                console.log('Audio ended, requesting next track');
                socketRef.current.emit('request_audio');
            }
        };

        const audioEl = audioRef.current;
        if (audioEl) {
            audioEl.addEventListener('ended', handleEnded);
        }

        return () => {
            if (audioEl) {
                audioEl.removeEventListener('ended', handleEnded);
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isPlaying, setIsPlaying }}>
            <audio ref={audioRef}></audio>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
