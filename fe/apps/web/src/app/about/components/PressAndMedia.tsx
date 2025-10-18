'use client'

import React from 'react'

interface PressCardProps {
  publication: string
  title: string
  snippet: string
  link: string
}

const PRESS_MENTIONS = [
  {
    logo: 'TechCrunch-logo',
    publication: 'TechCrunch',
    title: '"PlanGo\'s AI Revolution in Travel Planning"',
    snippet:
      'We explore how PlanGo is transforming how we think about travel planning with their innovative AI-powered itineraries.',
    link: '#'
  },
  {
    logo: 'Forbes-logo',
    publication: 'Forbes',
    title: '"Top 10 Travel Startups to Watch"',
    snippet:
      'PlanGo makes our list of must-watch companies that are redefining the industry.',
    link: '#'
  },
  {
    logo: 'Wired-logo',
    publication: 'Wired',
    title: '"The Future of AI in Travel"',
    snippet:
      'How PlanGo is using machine learning to create hyper-personalized travel experiences.',
    link: '#'
  }
]

const PressCard: React.FC<PressCardProps> = ({
  publication,
  title,
  snippet,
  link
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out">
    {/* Placeholder Logo */}
    <div
      className={`text-xl font-bold mb-3 ${publication.includes('Forbes') ? 'text-orange-600' : 'text-gray-800'}`}
    >
      {publication}
    </div>
    <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-sm text-gray-600 mb-4 min-h-[60px]">{snippet}</p>
    <a
      href={link}
      className="text-indigo-600 text-sm font-semibold hover:underline"
    >
      Read Full Article →
    </a>
  </div>
)

export const PressAndMedia: React.FC = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="text-center mb-12">
        <p className="uppercase text-sm text-gray-500 font-semibold mb-2 tracking-widest">
          In The News
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Press & Media</h2>
        <p className="text-md text-gray-600">
          See what industry leaders and media outlets are saying about PlanGo’s
          innovative approach to travel planning.
        </p>
      </div>

      {/* Press Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {PRESS_MENTIONS.map((mention) => (
          <PressCard key={mention.publication} {...mention} />
        ))}
      </div>

      {/* Media Inquiries CTA */}
      <div className="bg-indigo-700 p-8 rounded-lg text-center text-white">
        <h3 className="text-xl font-bold mb-2">Media Inquiries</h3>
        <p className="mb-6">
          Interested in featuring PlanGo in your publication? We&#39;d love to
          hear from you.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-indigo-700 transition duration-300 cursor-pointer">
            Press Kit Download
          </button>
          <button className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-300 cursor-pointer">
            Contact Press Team
          </button>
        </div>
      </div>
    </div>
  </section>
)
