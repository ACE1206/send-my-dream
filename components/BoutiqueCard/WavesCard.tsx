import React, { useEffect, useRef } from "react";
import Image from 'next/image'; // Импортируем Image из next/image
import styles from "./BoutiqueCard.module.scss";

const WavesCard: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let waves: { radius: number }[] = [];
        const waveGap = 50;       // Расстояние между волнами
        const waveSpeed = 2;      // Скорость расширения волн
        const maxRadius = Math.max(canvas.width, canvas.height) * 1.5; // Максимальный радиус волны до выхода за границы
        const waveInterval = 400; // Интервал появления волн в миллисекундах (0.2 секунды)
        const initialRadius = 50; // Начальный радиус новой волны
        let lastWaveTime = 0;     // Последнее время появления волны

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        // Функция для рисования ровной волны (идеальный круг)
        const drawWave = (radius: number) => {
            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2); // Рисуем круг
            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"; // Белый цвет с легкой прозрачностью
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        // Анимация волн
        const animateWaves = (timestamp: number) => {
            // Добавляем легкое полупрозрачное заполнение для эффекта следа
            ctx.fillStyle = 'rgba(79, 112, 207, .3)'; // Степень прозрачности влияет на длину следа
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Обновляем и рисуем каждую волну
            for (let wave of waves) {
                drawWave(wave.radius);
                wave.radius += waveSpeed; // Увеличиваем радиус для равномерного расширения
            }

            // Убираем волны, которые вышли за пределы, и добавляем новую волну по интервалу
            if (waves[0]?.radius > maxRadius) {
                waves.shift(); // Удаляем старую волну
            }

            // Создаем новую волну каждые 0.2 секунды
            if (timestamp - lastWaveTime > waveInterval) {
                waves.push({ radius: initialRadius }); // Добавляем новую волну с начальным радиусом 100px
                lastWaveTime = timestamp;
            }

            animationFrameId = requestAnimationFrame(animateWaves);
        };

        // Обработчик изменения размера окна
        const handleResize = () => {
            resizeCanvas();
            waves = [];
            lastWaveTime = 0;
        };

        // Инициализация
        resizeCanvas();

        // Запуск анимации с передачей метки времени
        animationFrameId = requestAnimationFrame(animateWaves);

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className={styles.aiCard}>
            <Image src='/images/logo.webp' alt='' width={500} height={500} />
            <canvas className={styles.starField} ref={canvasRef}></canvas>
        </div>
    );
};

export default WavesCard;
