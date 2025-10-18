"use client"

import React from 'react';
import {FaPhone} from "react-icons/fa";
import {CiCircleCheck} from "react-icons/ci";

export const CallToAction: React.FC = () => (
    <section
        className="mx-40 mt-12 py-20 bg-gradient-to-r from-indigo-700 to-purple-600 text-white relative overflow-hidden rounded-4xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500 opacity-30 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Planning?</h2>
            <p className="text-lg mb-8">
                Join thousands of travelers who have discovered the joy of effortless trip planning. Let PlanGo turn
                your travel dreams into reality.
            </p>

            <div className="flex justify-center space-x-4 mb-6">
                <button
                    className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 flex items-center space-x-2 cursor-pointer">
                    <span className="text-xl">✈️</span>
                    <span>Start Planning Now</span>
                </button>
                <button
                    className="border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-indigo-700 transition duration-300 flex items-center space-x-2 cursor-pointer">
                    <span className="text-xl"><FaPhone/></span>
                    <span>Contact Us</span>
                </button>
            </div>

            <div className="flex justify-center space-x-6 text-sm opacity-80 text-white">
                <span className="flex items-center space-x-1"><CiCircleCheck/> <p>Free to start</p></span>
                <span
                    className="flex items-center space-x-1"><CiCircleCheck/> <p>No credit card required</p></span>
                <span className="flex items-center space-x-1"><CiCircleCheck/> <p>Cancel anytime</p></span>
            </div>
        </div>
    </section>
);
