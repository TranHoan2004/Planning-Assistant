"use client"

import React from "react";

interface AwardCardProps {
    icon: string;
    title: string;
    category: string;
}

const AWARDS = [
    {icon: '🏆', title: 'Best Travel App 2024', category: 'Travel + Leisure Awards'},
    {icon: '💡', title: 'Innovation Award', category: 'Tech Innovation Summit'},
    {icon: '⭐', title: 'Startup of the Year', category: 'Silicon Valley Awards'},
    {icon: '✨', title: 'Best UX Design', category: 'Design Excellence Awards'},
];

const AwardCard: React.FC<AwardCardProps> = ({icon, title, category}) => (
    <div className="bg-white p-6 rounded-lg shadow-md text-center h-full border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out">
        <div className="w-12 h-12 rounded-full bg-gray-100 text-2xl flex items-center justify-center mx-auto mb-3">
            {icon}
        </div>
        <h4 className="text-lg font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-xs text-gray-500">{category}</p>
    </div>
);

export const AwardsAndAchievements: React.FC = () => (
    <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Awards & Achievements</h2>
            <p className="text-md text-gray-600 mb-12">
                We&#39;re honored to be recognized by industry leaders and organizations worldwide.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {AWARDS.map((award) => (
                    <AwardCard key={award.title} {...award} />
                ))}
            </div>
        </div>
    </section>
);
