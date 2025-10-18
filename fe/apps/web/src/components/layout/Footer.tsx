import React from 'react';
import Link from "next/link";
import {Image} from "@heroui/image";
import {MdEmail, MdLocationOn, MdPhone, MdPrint} from "react-icons/md";

const Footer = () => {
    const email = "example@gmail.com"
    const phone = "0912345678"
    const fax = "0123456789"

    return (
        <footer className="bg-black mt-16">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-white">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                            <Image
                                src="/white-bg-logo.png"
                                className="h-10 w-auto"
                                alt="Planggo Logo"
                            />
                            <h3 className="text-white font-bold text-2xl">PLANGGO</h3>
                        </div>
                        <p className="text-sm leading-relaxed">
                            AI-powered travel planning for the modern explorer. Discover, plan, and experience your
                            perfect journey.
                        </p>

                        {/* Social Media */}
                        <div className="flex gap-3 pt-4">
                            <Link
                                href="https://www.facebook.com/profile.php?id=61581120443948"
                                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-blue-600 flex items-center justify-center hover:text-white transition-all duration-300 transform hover:scale-110"
                                aria-label="Facebook"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </Link>
                            <Link
                                href="#"
                                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-blue-400 flex items-center justify-center  hover:text-white transition-all duration-300 transform hover:scale-110"
                                aria-label="Twitter"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </Link>
                            <Link
                                href="https://www.instagram.com/plango.vn/"
                                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-pink-600 flex items-center justify-center  hover:text-white transition-all duration-300 transform hover:scale-110"
                                aria-label="Instagram"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </Link>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-gray-900 flex items-center justify-center hover:text-white transition-all duration-300 transform hover:scale-110"
                                aria-label="TikTok"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="text-white font-semibold text-base mb-6 uppercase tracking-wider">
                            Products
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/features"
                                    className="hover:text-white transition-colors text-sm flex items-center group"
                                >
                                    <span
                                        className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/pricing"
                                    className="transition-colors text-sm flex items-center group"
                                >
                                    <span
                                        className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/api"
                                    className="transition-colors text-sm flex items-center group"
                                >
                                    <span
                                        className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                    API
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/mobile-app"
                                    className="transition-colors text-sm flex items-center group"
                                >
                                    <span
                                        className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                    Mobile App
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold text-base mb-6 uppercase tracking-wider">
                            Support
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/help"
                                    className="hover:text-white transition-colors text-sm flex items-center group"
                                >
                                    <span
                                        className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/affiliate"
                                    className="hover:text-white transition-colors text-sm flex items-center group"
                                >
                                    <span
                                        className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                    Become an Affiliate
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/community"
                                    className="hover:text-white transition-colors text-sm flex items-center group"
                                >
                                    <span
                                        className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="hover:text-white transition-colors text-sm flex items-center group"
                                >
                                    <span
                                        className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                    About us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold text-base mb-6 uppercase tracking-wider">
                            Contact
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm group">
                                <MdLocationOn className="text-white mt-1 flex-shrink-0" size={18}/>
                                <span className="group-hover:text-gray-300 transition-colors">
                                    Thach Hoa District, Hanoi, Vietnam
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-sm group">
                                <MdEmail className="text-white flex-shrink-0" size={18}/>
                                <Link
                                    href={`mailto:${email}`}
                                    className="group-hover:text-gray-300 transition-colors"
                                >
                                    {email}
                                </Link>
                            </li>
                            <li className="flex items-center gap-3 text-sm group">
                                <MdPhone className="text-white flex-shrink-0" size={18}/>
                                <Link
                                    href={`tel:${phone}`}
                                    className="group-hover:text-gray-300 transition-colors"
                                >
                                    {phone}
                                </Link>
                            </li>
                            <li className="flex items-center gap-3 text-sm group">
                                <MdPrint className="text-white flex-shrink-0" size={18}/>
                                <span className="group-hover:text-gray-300 transition-colors">
                                    {fax}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="mt-6 mb-4 border-t border-slate-700"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white">
                    <p className="text-sm text-center md:text-left">
                        © 2025 Planggo.com. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link href="/terms" className="transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/policy" className="transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/cookies" className="transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
