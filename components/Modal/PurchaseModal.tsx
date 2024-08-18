// Модальное пополнения

import React, {useState} from 'react';
import styles from './Modal.module.scss';
import ReactPlayer from 'react-player';
import {CardData, ModalProps} from '../../utils/types';

const MeditationModal: React.FC<CardData & ModalProps> = ({video, onClose}) => {
    const [confirmed, setConfirmed] = useState(false);
    const [playerVisible, setPlayerVisible] = useState(false);
    const [duration, setDuration] = useState(0);

    const handleConfirm = () => {
        setConfirmed(true);
    };

    const handleDuration = (duration: number) => {
        setDuration(duration);
    };

    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes} min, ${seconds < 10 ? '0' : ''}${seconds} sec`;
    };

    const getYoutubeThumbnail = (url: string) => {
        const videoId = url.split('v=')[1];
        return `https://img.youtube.com/vi/${videoId}/0.jpg`;
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {!confirmed ? (
                    <div className={styles.content}>
                        <h2>Confirm your purchase</h2>
                        <p>The cost of audio meditation is <b>5 coins</b>, confirm your purchase</p>
                        <button onClick={handleConfirm}>Confirm</button>
                    </div>
                ) : (
                    <div className={styles.video}>
                        {!playerVisible ? (
                            <div className={styles.videoCover}>
                                <img src={getYoutubeThumbnail('https://www.youtube.com/watch?v=KcU6w1Pr5gc')}
                                     alt="Video Cover" width={2000} height={1000}/>
                                <div>
                                    <h3>Meditation</h3>
                                    <span>Duration: {formatDuration(duration)}</span>
                                </div>
                                <button onClick={() => setPlayerVisible(true)} className={styles.playButton}></button>
                            </div>
                        ) : (
                            <div className={styles.mainVideo}>
                                <ReactPlayer
                                    url={'https://www.youtube.com/watch?v=KcU6w1Pr5gc'}
                                    width="100%"
                                    height="100%"
                                    controls={false}
                                    playing={true}
                                    onDuration={handleDuration}
                                />
                            </div>
                        )}
                        <button onClick={onClose} className={`hide-on-desktop`}>Close</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MeditationModal;
