"use client"

import React from "react";

const PROCESS_STEPS = [
    {
        step: 1,
        title: 'You Prompt',
        description: 'Type your destination, dates, and any specific interests. All set.'
    },
    {
        step: 2,
        title: 'We Listen',
        description: 'Our AI engine analyzes millions of data points to understand your vibe.'
    },
    {
        step: 3,
        title: 'Draft',
        description: 'Instantly creates a day-by-day itinerary, including booking and pricing.'
    },
    {step: 4, title: 'You Approve', description: 'Tweak anything to make it perfect. Save your preferences.'},
    {
        step: 5,
        title: 'We Book',
        description: 'Auto-book flights, hotels, experiences, and even dining at top restaurants.'
    },
];

interface ProcessStepCardProps {
    step: number;
    title: string;
    description: string;
}

const ProcessStepCard: React.FC<ProcessStepCardProps> = ({step, title, description}) => (
    <div className="flex flex-col items-center text-center">
        <div
            className={`w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center mb-3 text-lg`}>
            {step}
        </div>
        <h4 className="text-xl font-semibold text-gray-800 mb-1">{title}</h4>
        <p className="text-sm text-gray-500 max-w-[150px]">{description}</p>
    </div>
);

export const HowPlangoWorks: React.FC = () => (
    <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 max-w-6xl text-center">
            <p className="uppercase text-sm text-gray-500 font-semibold mb-2 tracking-widest">The Process</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How PlanGo Works</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                From idea to itinerary in just a few simple steps. Experience the future of travel planning.
            </p>

            {/* Steps Grid */}
            <div className="grid grid-cols-5 items-start justify-between">
                {PROCESS_STEPS.map((step, index) => (
                    <React.Fragment key={step.step}>
                        <ProcessStepCard {...step} />
                        {/* Dấu mũi tên/đường nối (chỉ hiển thị giữa các bước) */}
                        {index < PROCESS_STEPS.length - 1 && (
                            <div className="h-0.5 bg-gray-300 relative top-6 -mx-4 hidden md:block"/>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    </section>
);
