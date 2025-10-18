"use client"

import React from "react";

const CORE_VALUES = [
    {
        icon: '🛡️',
        title: 'Safety',
        description: 'Your security and privacy are our top priorities. We ensure safe travel.'
    },
    {
        icon: '🖊️',
        title: 'Simplicity',
        description: 'Complete travel planning made simple. We eliminate complexity and stress.'
    },
    {
        icon: '💛',
        title: 'Delight',
        description: 'Every interaction should spark joy. We want delightful experiences that last.'
    },
    {
        icon: '✅',
        title: 'Integrity',
        description: 'Honest recommendations, transparent pricing. We build trust through our actions.'
    },
];

export const CoreValues: React.FC = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
            <p className="uppercase text-sm text-gray-500 font-semibold mb-2 tracking-widest">What We Stand For</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 mb-12">
                These principles guide every decision we make and every feature we build
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {CORE_VALUES.map((value) => (
                    <div key={value.title} className="p-6 relative shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out">
                        <div className="text-5xl mb-4 flex justify-center items-center">
                            {value.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                        <p className="text-sm text-gray-600">{value.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);
