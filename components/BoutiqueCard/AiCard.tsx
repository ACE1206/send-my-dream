import React, { useEffect, useRef } from "react";
import styles from "./BoutiqueCard.module.scss";
import Image from "next/image";

const AiCard: React.FC<{ onClick?: () => void }> = ({onClick}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let stars: { x: number; y: number; z: number }[] = [];
        let clouds: { x: number; y: number; radius: number; opacity: number; speedX: number; speedY: number }[] = [];

        // Параметры настройки
        const numStars = 500;  // Количество звезд
        const numCloudParticles = 10;  // Количество частиц тумана
        const starSpeed = 2;   // Скорость движения звезд

        // Функция для изменения размера canvas
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        // Создание массива звезд со случайными координатами
        const createStars = () => {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width - canvas.width / 2,
                    y: Math.random() * canvas.height - canvas.height / 2,
                    z: Math.random() * canvas.width,
                });
            }
        };

        // Создание частиц тумана с более сильным размытием и случайными параметрами
        const createCloudParticles = () => {
            clouds = [];
            for (let i = 0; i < numCloudParticles; i++) {
                clouds.push({
                    x: Math.random() * canvas.width * 2 - canvas.width, // Начальное положение за пределами canvas
                    y: Math.random() * canvas.height * 2 - canvas.height, // Начальное положение за пределами canvas
                    radius: 100 + Math.random() * 300, // Радиус облачной частицы
                    opacity: 0.05 + Math.random() * 0.0001, // Очень низкая прозрачность для мягкости
                    speedX: (Math.random() - 0.5) * 2, // Случайная горизонтальная скорость
                    speedY: (Math.random() - 0.5) * 2, // Случайная вертикальная скорость
                });
            }
        };

        // Функция для отрисовки размытых облачных частиц
        const drawCloudParticles = () => {
            clouds.forEach(cloud => {
                // Плавное движение облачных частиц
                cloud.x += cloud.speedX;
                cloud.y += cloud.speedY;

                // Если частица уходит за пределы, она перемещается на противоположную сторону
                if (cloud.x - cloud.radius > canvas.width) cloud.x = -cloud.radius;
                if (cloud.x + cloud.radius < 0) cloud.x = canvas.width + cloud.radius;
                if (cloud.y - cloud.radius > canvas.height) cloud.y = -cloud.radius;
                if (cloud.y + cloud.radius < 0) cloud.y = canvas.height + cloud.radius;

                // Рисуем размытые частицы тумана с сильным размытие через градиент
                const gradient = ctx.createRadialGradient(
                    cloud.x, cloud.y, cloud.radius * 0.3,
                    cloud.x, cloud.y, cloud.radius
                );
                gradient.addColorStop(0, `rgba(150, 150, 200, ${cloud.opacity})`); // Центр частицы с низкой прозрачностью
                gradient.addColorStop(1, "rgba(2, 5, 43, 0)"); // Полностью прозрачный край

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        // Функция для отрисовки звезд
        const drawStars = () => {
            for (let star of stars) {
                star.z -= starSpeed;
                if (star.z <= 0) {
                    star.z = canvas.width;
                }

                const k = 256 / star.z;
                const x = star.x * k + canvas.width / 2;
                const y = star.y * k + canvas.height / 2;

                if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
                    const size = (1 - star.z / canvas.width) * 2;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fillStyle = "rgba(255, 255, 255, 1)";
                    ctx.fill();
                }
            }
        };

        // Функция анимации для тумана и звезд
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем canvas

            // Рисуем темный фон
            ctx.fillStyle = "#02052b";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawCloudParticles(); // Отрисовываем туман на заднем плане
            drawStars(); // Отрисовываем звезды на переднем плане

            animationFrameId = requestAnimationFrame(animate);
        };

        // Обработчик изменения размера окна
        const handleResize = () => {
            resizeCanvas();
            createStars();
            createCloudParticles();
        };

        // Инициализация
        resizeCanvas();
        createStars();
        createCloudParticles();
        animate();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className={styles.aiCard} onClick={onClick}>
            <Image src={'/images/logo.webp'} alt={''} width={500} height={500}/>
            <canvas className={styles.starField} ref={canvasRef}></canvas>
        </div>
    );
};

export default AiCard;
