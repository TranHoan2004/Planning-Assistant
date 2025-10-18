"use client"

import React, { useEffect, useRef, useState } from "react";

interface CounterProps {
    target: number;
    suffix?: string;
    label: string;
    duration?: number;
}

const Counter: React.FC<CounterProps> = ({ target, suffix = "+", label, duration = 1500 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!visible) return;

        const startTime = performance.now();

        const animate = (time: number) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const current = Math.floor(progress * target);
            setCount(current);
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(target);
        };

        requestAnimationFrame(animate);
    }, [visible, target, duration]);

    return (
        <div ref={ref}>
            <p className="text-3xl font-bold">{count.toLocaleString()}{suffix}</p>
            <p className="text-sm">{label}</p>
        </div>
    );
};

export const AboutUsHeader: React.FC = () => (
    <header
        className="bg-gradient-to-r from-indigo-800 to-purple-600 text-white pt-10 pb-20 relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500 opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
            <p className="uppercase text-sm mb-2">About PlanGo</p>
            <h1 className="text-5xl font-bold mb-4">Making Travel Planning Effortless</h1>
            <p className="text-lg max-w-3xl mx-auto mb-8">
                We blend AI recommendations with travel expertise to craft personalized itineraries that make every
                trip easy, personal, and memorable.
            </p>

            <div className="flex justify-center space-x-4 mb-16">
                <button
                    className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 cursor-pointer">
                    Meet the Team
                </button>
                <button
                    className="border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-indigo-700 transition duration-300 cursor-pointer">
                    Our Story
                </button>
            </div>

            <div className="flex justify-center space-x-12">
                <Counter target={10000} label="Happy Travelers" />
                <Counter target={50000} label="Trips Planned" />
                <Counter target={150} label="Destinations" suffix="+" />
            </div>
        </div>
    </header>
);
