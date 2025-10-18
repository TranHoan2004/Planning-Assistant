"use client"

import React from "react";

export const MissionVision: React.FC = () => (
    <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl text-center">
            <p className="uppercase text-sm text-indigo-600 font-semibold mb-2 tracking-widest">Purpose &
                Direction</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
            <p className="text-lg text-gray-600 mb-12">
                We&#39;re driven by a clear purpose and guided by an ambitious vision for the future of travel.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Mission Card */}
                <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-indigo-500 text-left">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl text-indigo-600 mr-3">⊙</span> {/* Placeholder Icon */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
                            <p className="text-indigo-500 italic text-sm">What drives us daily</p>
                        </div>
                    </div>
                    <p className="mb-4 text-gray-600">
                        Make travel planning frictionless by bringing seamless and personal travel experiences to
                        everyone, everywhere.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">✅ <span className="ml-2">Eliminate the complexity of travel planning</span>
                        </li>
                        <li className="flex items-start">✅ <span className="ml-2">Provide personalized recommendations for every traveler</span>
                        </li>
                        <li className="flex items-start">✅ <span className="ml-2">Make travel accessible and enjoyable for all</span>
                        </li>
                    </ul>
                </div>

                {/* Vision Card */}
                <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-purple-500 text-left">
                    <div className="flex items-center mb-4">
                        <span className="text-2xl text-purple-600 mr-3">👁️</span> {/* Placeholder Icon */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
                            <p className="text-purple-500 italic text-sm">Where we&#39;re heading</p>
                        </div>
                    </div>
                    <p className="mb-4 text-gray-600">
                        To be the world&#39;s most trusted AI travel planner, transforming how people discover and
                        experience the world.
                    </p>
                    <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start">⭐ <span className="ml-2">Global leader in AI-powered travel planning</span>
                        </li>
                        <li className="flex items-start">⭐ <span className="ml-2">Trusted by millions of travelers worldwide</span>
                        </li>
                        <li className="flex items-start">⭐ <span className="ml-2">Pioneer in sustainable and responsible tourism</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);
