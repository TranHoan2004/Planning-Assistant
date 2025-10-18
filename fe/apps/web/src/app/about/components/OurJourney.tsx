'use client'

import React from 'react'
import { Image } from '@heroui/react'

export const OurJourney: React.FC = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4 max-w-6xl">
      <h2 className="text-xl font-bold text-gray-700 mb-10 tracking-widest uppercase border-b border-gray-200 pb-2">
        Our Journey
      </h2>
      <div className="grid md:grid-cols-2 gap-12">
        {/* Text Column */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            How PlanGo Came to Life
          </h3>
          <p className="mb-4 text-gray-600">
            PlanGo started with a simple idea: travel planning should be
            exciting, not exhausting. The founders experienced the frustration
            of spending countless hours researching destinations, comparing
            prices, and coordinating logistics.
          </p>
          <p className="mb-4 text-gray-600">
            We realized that while technology had transformed many aspects of
            our lives, travel planning remained unnecessarily complex.
            That&#39;s why we decided to create PlanGo—to use the power of AI to
            make travel planning effortless, personalized, and memorable.
          </p>
          <p className="mb-6 text-gray-600">
            Today, we are proud to have freed thousands of travelers to discover
            amazing destinations while saving time and reducing stress. Every
            feature we build is designed with one goal: to make planning your
            travel dreams accessible and enjoyable.
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="font-semibold">Founded in 2025</span>
            <span>•</span>
            <span>Based in Hanoi</span>
          </div>
        </div>

        {/* Image/Quote Column */}
        <div>
          <div className="bg-purple-600 p-6 rounded-lg shadow-xl">
            <Image
              isBlurred
              isZoomed
              width={"100%"}
              height={300}
              src="our-team/team.png"
              alt="Team collaborating"
              className="w-full h-auto object-cover rounded-md mb-4"
            />
            <div className="text-white">
              <p className="uppercase text-xs font-semibold mb-2">
                Listen - Plan - Book
              </p>
              <blockquote className="italic text-xl">
                &#34;One trip, One plan, One unforgettable trip. Plan Less,
                Travel More.&#34;
              </blockquote>
              <footer className="mt-2 text-sm">
                — PlanGo Mission Statement
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)
