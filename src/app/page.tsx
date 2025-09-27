'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import SpaceBackground from "@/components/SpaceBackground";

// Dynamically import Lottie components with proper setup
const AccuracyLottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
});

const AILottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
});

const BlockchainLottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
});

const CommunityLottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
});

const FastLottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
});

const MoneyLottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
});

const TransparencyLottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
});

const AnalyticsLottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
});

const ChainLottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
});

const GlobeLottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
});

const MobileLottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
});

const NgosLottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
});

const VerificationLottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-16 h-16 bg-gray-800 rounded-full animate-pulse"></div>
});

// Import animation data
import accuracyAnimation from "@/components/lotties/ACCURACY.json";
import aiAnimation from "@/components/lotties/AI.json";
import analyticsAnimation from "@/components/lotties/ANALYTICS.json";
import blockchainAnimation from "@/components/lotties/BLOCKCHAIN.json";
import chainAnimation from "@/components/lotties/CHAIN.json";
import communityAnimation from "@/components/lotties/COMMUNITY.json";
import fastAnimation from "@/components/lotties/FAST.json";
import globeAnimation from "@/components/lotties/GLOBE.json";
import mobileAnimation from "@/components/lotties/MOBILE.json";
import moneyAnimation from "@/components/lotties/MONEY.json";
import ngosAnimation from "@/components/lotties/NGOS.json";
import transparencyAnimation from "@/components/lotties/TRANSPARENCY.json";
import verificationAnimation from "@/components/lotties/VERIFICATION.json";
import AutoSwapParagraph from "@/components/AutoSwapParagraph";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add paragraphs and index state for AutoDots
  const paragraphs = [
    "Join the revolution in carbon credit management. Our blockchain-powered platform transforms how we verify, trade, and restore our planet's precious ecosystems through cutting-edge technology and community-driven environmental action.",
    "Empower your business and community with transparent, AI-driven carbon credit solutions. CarbonX ensures every action for the planet is verified, impactful, and rewarded.",
    "Experience the next generation of environmental stewardship—secure, scalable, and built for a sustainable future with CarbonX."
  ];
  // If you want to control the current paragraph index for AutoDots, add this state:
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Smooth scrolling function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  // Handle navigation clicks
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <SpaceBackground>
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-blue-800/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        {/* Navigation */}
        <nav className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold text-white">
                CarbonX
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Home</a>
              <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Features</a>
              <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">About</a>
              <a href="#service" onClick={(e) => handleNavClick(e, 'service')} className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Service</a>
              <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer">Contact</a>

              {/* Authentication Section */}
              <div className="flex items-center space-x-4">
                <SignedOut>
                  <Link href="/sign-in">
                    <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </SignedIn>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white focus:outline-none"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                  <span className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-white transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Hero Section */}
        <main id="home" className="relative z-10 px-6 pt-20 pb-32">
          <div className="max-w-7xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Floating Elements */}
              <div className="absolute top-10 left-10 w-4 h-4 bg-blue-500 rounded-full opacity-60 animate-bounce"></div>
              <div className="absolute top-20 right-20 w-2 h-2 bg-cyan-400 rounded-full opacity-40 animate-pulse"></div>
              <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-emerald-400 rounded-full opacity-50 animate-ping"></div>

              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  CarbonX
                </span>
              </h1>

              <h2 className="text-2xl md:text-4xl lg:text-5xl font-light mb-8 text-blue-300 tracking-wider">
                SAVE OUR PLANET
              </h2>

              <div className="text-lg md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto overflow-hidden">
                {/* Pass setIndex to AutoSwapParagraph if you want to sync dots */}
                <AutoSwapParagraph />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-12 py-4 text-lg font-semibold border-2 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105">
                  LEARN MORE
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-blue-400 hover:text-white px-12 py-4 text-lg font-semibold transition-all duration-300 backdrop-blur-sm hover:scale-105">
                  WATCH DEMO
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Enhanced Features Section */}
        <section id="features" className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                  Revolutionary Technology
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the future of environmental conservation with our cutting-edge platform
              </p>
              <div className="flex justify-center items-center space-x-4 mt-8">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-blue-500"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-16 h-px bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <div className="w-12 h-px bg-gradient-to-r from-cyan-500 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section id="features" className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                  Revolutionary Technology
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the future of environmental conservation with our cutting-edge platform
              </p>
              <div className="flex justify-center items-center space-x-4 mt-8">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-blue-500"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-16 h-px bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <div className="w-12 h-px bg-gradient-to-r from-cyan-500 to-transparent"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                    <div className="flex items-center justify-center w-full h-full">
                      <BlockchainLottie
                        animationData={blockchainAnimation}
                        loop={true}
                        autoplay={true}
                        className="w-16 h-16"
                      />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">Immutable Registry</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  Blockchain-powered verification ensures 99.99% uptime with immutable audit trails and complete transparency
                </p>
                <div className="mt-6 flex items-center text-sm text-blue-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  99.99% Uptime SLA
                </div>
              </Card>

              <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                    <div className="flex items-center justify-center w-full h-full">
                      <AILottie
                        animationData={aiAnimation}
                        loop={true}
                        autoplay={true}
                        className="w-16 h-16"
                      />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors">AI-Powered Verification</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  Real-time automated validation using satellite imagery, drone surveillance, and advanced computer vision
                </p>
                <div className="mt-6 flex items-center text-sm text-purple-400">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  99.9% Accuracy Rate
                </div>
              </Card>

              <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                    <div className="flex items-center justify-center w-full h-full">
                      <CommunityLottie
                        animationData={communityAnimation}
                        loop={true}
                        autoplay={true}
                        className="w-16 h-16"
                      />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-300 transition-colors">Community Ecosystem</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  Mobile-first data collection with gamified user engagement, NGO collaboration, and government integration
                </p>
                <div className="mt-6 flex items-center text-sm text-emerald-400">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  Global Community
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  Performance Metrics
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Real-time analytics showcasing CarbonX's superior performance compared to traditional carbon credit systems
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <AccuracyLottie
                        animationData={accuracyAnimation}
                        loop={true}
                        autoplay={true}
                        className="w-12 h-12"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">99.9%</div>
                  <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Accuracy Rate</div>
                  <div className="mt-3 text-xs text-emerald-400 font-medium">AI-Powered Precision</div>
                </div>
              </Card>

              <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <FastLottie
                        animationData={fastAnimation}
                        loop={true}
                        autoplay={true}
                        className="w-12 h-12"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors">1000x</div>
                  <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Faster Processing</div>
                  <div className="mt-3 text-xs text-purple-400 font-medium">Lightning Speed</div>
                </div>
              </Card>

              <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <MoneyLottie
                        animationData={moneyAnimation}
                        loop={true}
                        autoplay={true}
                        className="w-12 h-12"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors">90%</div>
                  <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Cost Reduction</div>
                  <div className="mt-3 text-xs text-emerald-400 font-medium">Maximum Savings</div>
                </div>
              </Card>

              <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10">
                <div className="text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <TransparencyLottie
                        animationData={transparencyAnimation}
                        loop={true}
                        autoplay={true}
                        className="w-12 h-12"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300 transition-colors">100%</div>
                  <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Transparency</div>
                  <div className="mt-3 text-xs text-cyan-400 font-medium">Complete Visibility</div>
                </div>
              </Card>
            </div>

            {/* Comparison Bar */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center space-x-6 bg-gray-900/50 border border-gray-700 rounded-full px-8 py-4 backdrop-blur-sm">
                <span className="text-gray-400 text-sm">Traditional Systems</span>
                <div className="flex space-x-2">
                  <div className="w-8 h-2 bg-red-500/50 rounded-full"></div>
                  <div className="w-8 h-2 bg-red-400/50 rounded-full"></div>
                  <div className="w-8 h-2 bg-red-300/50 rounded-full"></div>
                </div>
                <span className="text-blue-400 font-bold">VS</span>
                <div className="flex space-x-2">
                  <div className="w-8 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                  <div className="w-8 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
                  <div className="w-8 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
                  <div className="w-8 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                </div>
                <span className="text-emerald-400 text-sm font-semibold">CarbonX</span>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  About CarbonX
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Revolutionizing carbon credit management through blockchain innovation and AI-powered verification
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6 text-white">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  CarbonX is pioneering the future of environmental conservation by creating a transparent, efficient, and scalable platform for carbon credit management. We combine cutting-edge blockchain technology with artificial intelligence to ensure every carbon credit is verifiable, traceable, and impactful.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Our platform empowers communities, businesses, and governments to participate in the global carbon market with confidence, knowing that their environmental efforts are backed by immutable technology and real-time verification.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">🌍</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Global Impact</h4>
                    <p className="text-gray-400">Connecting stakeholders worldwide</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                <Card className="relative bg-gray-900/50 border-gray-700 backdrop-blur-sm p-8">
                  <h4 className="text-2xl font-bold mb-4 text-white">Key Achievements</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <span className="text-white font-medium">99.9% Verification Accuracy</span>
                        <p className="text-gray-400 text-sm">AI-powered validation system</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                      <div>
                        <span className="text-white font-medium">1000x Faster Processing</span>
                        <p className="text-gray-400 text-sm">Compared to traditional methods</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                      <div>
                        <span className="text-white font-medium">90% Cost Reduction</span>
                        <p className="text-gray-400 text-sm">Lower verification expenses</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <span className="text-white font-medium">100% Transparency</span>
                        <p className="text-gray-400 text-sm">Blockchain-backed audit trails</p>
                      </div>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Service Section */}
        <section id="service" className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Our Services
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive carbon credit management solutions powered by blockchain and AI
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ChainLottie
                    animationData={chainAnimation}
                    loop={true}
                    autoplay={true}
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">Carbon Registry</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors mb-4">
                  Secure blockchain-based carbon credit registration and management with immutable audit trails
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Real-time verification</li>
                  <li>• Immutable records</li>
                  <li>• Global accessibility</li>
                </ul>
              </Card>

              <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <VerificationLottie
                    animationData={verificationAnimation}
                    loop={true}
                    autoplay={true}
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors">AI Verification</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors mb-4">
                  Advanced AI-powered validation using satellite imagery and computer vision technology
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Satellite analysis</li>
                  <li>• Drone integration</li>
                  <li>• 99.9% accuracy</li>
                </ul>
              </Card>

              <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <GlobeLottie
                    animationData={globeAnimation}
                    loop={true}
                    autoplay={true}
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-300 transition-colors">Marketplace</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors mb-4">
                  Transparent trading platform for carbon credits with smart contract automation
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Automated trading</li>
                  <li>• Price transparency</li>
                  <li>• Instant settlement</li>
                </ul>
              </Card>

              <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <AnalyticsLottie
                    animationData={analyticsAnimation}
                    loop={true}
                    autoplay={true}
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-orange-300 transition-colors">Analytics Dashboard</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors mb-4">
                  Real-time analytics and reporting for carbon credit performance and environmental impact
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Performance metrics</li>
                  <li>• Impact tracking</li>
                  <li>• Custom reports</li>
                </ul>
              </Card>

              <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <NgosLottie
                    animationData={ngosAnimation}
                    loop={true}
                    autoplay={true}
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-300 transition-colors">NGO Integration</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors mb-4">
                  Seamless collaboration tools for NGOs, governments, and environmental organizations
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Project collaboration</li>
                  <li>• Data sharing</li>
                  <li>• Impact measurement</li>
                </ul>
              </Card>

              <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MobileLottie
                    animationData={mobileAnimation}
                    loop={true}
                    autoplay={true}
                    className="w-12 h-12"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-green-300 transition-colors">Mobile App</h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors mb-4">
                  Mobile-first platform for data collection, verification, and community engagement
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Offline capability</li>
                  <li>• Gamification</li>
                  <li>• Real-time sync</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {/* Team Emblem */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
                  <img
                    src="/erasebg-transformed.png"
                    alt="Team Tech Titans Emblem"
                    className="relative w-32 h-32 md:w-40 md:h-40 object-contain animate-pulse"
                  />
                </div>
              </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-red-600 bg-clip-text text-transparent">
                 BLOCKBUSTERS
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the brilliant minds behind CarbonX - aspiring to win Smart India Hackathon 2025 and revolutionize carbon credit management
            </p>

              {/* Decorative Elements */}
              <div className="flex justify-center items-center space-x-4 mt-8">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-blue-500"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-20 h-px bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce"></div>
                <div className="w-16 h-px bg-gradient-to-r from-cyan-500 to-transparent"></div>
              </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "MALAY RAVAL",
                role: "Team Lead & Backend Engineer",
                specialty: "Full-Stack • Blockchain • System Design • AI/ML",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                name: "BHAGIRATHSINH RANA",
                role: "Super Senior Frontend Engineer",
                specialty: "Designer • Expert Animators • Responsive Designs",
                gradient: "from-emerald-500 to-teal-500"
              },
              {
                name: "VIVEK PANKHANIYA",
                role: "Senior Blockchain Engineer",
                specialty: "Solidity • Web3 • Smart Contracts",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                name: "DEV PATEL",
                role: "Senior Frontend Engineer",
                specialty: "React • Next.js • TypeScript • UI/UX",
                gradient: "from-orange-500 to-red-500"
              },
              {
                name: "TISHA DAUDRA",
                role: "Senior Product Manager",
                specialty: "Strategy • Analytics • Growth • UX",
                gradient: "from-indigo-500 to-purple-600"
              },
              {
                name: "KHUSHI BOSAMIYA",
                role: "Lead UI/UX Designer",
                specialty: "Design Systems • Figma • Prototyping",
                gradient: "from-green-500 to-emerald-600"
              }
            ].map((member, index) => (
              <div key={index} className="group relative">
                <Card className="bg-gray-900/30 border-gray-700 backdrop-blur-sm p-8 hover:bg-gray-800/50 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
                  {/* Card Front */}
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${member.gradient} flex items-center justify-center text-4xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    ?
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white text-center">{member.name}</h3>
                  <p className="text-blue-400 text-center font-medium">{member.role}</p>
                  <p className="text-gray-400 text-center text-sm mt-2">{member.specialty}</p>

                    {/* Hover Indicator */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-blue-400 font-semibold">Hover for details</span>
                    </div>
                  </Card>

                  {/* Hover Details Card */}
                  <Card className="absolute top-0 left-0 w-full bg-gray-900/95 border-blue-500/50 backdrop-blur-sm p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 pointer-events-none z-10">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${member.gradient} flex items-center justify-center text-2xl mb-4 mx-auto`}>
                      ?
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white text-center">{member.name}</h3>
                    <p className="text-blue-400 text-center font-medium text-sm mb-2">{member.role}</p>
                    <p className="text-gray-300 text-center text-xs mb-3">{member.specialty}</p>
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-4 text-xs text-gray-400">
                        <span>💡 Innovation</span>
                        <span>⚡ Excellence</span>
                        <span>🚀 Leadership</span>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {/* Team Badge */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-full px-8 py-4 backdrop-blur-sm">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-blue-400 font-semibold">Aspiring for Smart India Hackathon 2025</span>
                <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative z-10 px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  Get In Touch
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Ready to revolutionize your carbon credit management? Let's discuss how CarbonX can transform your environmental impact
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold mb-6 text-white">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">📧</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Email</h4>
                      <p className="text-gray-400">team@carbonx.tech</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">📱</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Phone</h4>
                      <p className="text-gray-400">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl">📍</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Location</h4>
                      <p className="text-gray-400">Ahmedabad, Gujarat, India</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
                  <div className="flex space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <span className="text-white">📘</span>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <span className="text-white">🐦</span>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <span className="text-white">💼</span>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                      <span className="text-white">📧</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-xl"></div>
                <Card className="relative bg-gray-900/50 border-gray-700 backdrop-blur-sm p-8">
                  <h4 className="text-2xl font-bold mb-6 text-white">Send us a Message</h4>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white resize-none"
                        placeholder="Tell us about your project..."
                      ></textarea>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 font-semibold"
                      onClick={() => alert('Thank you for your message! We will get back to you soon.')}
                    >
                      Send Message
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-white">
                CarbonX
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              © 2025 CarbonX. Building the future of carbon credit management.
            </p>
            <p className="text-sm text-gray-500">
              Smart India Hackathon 2025 | Team BlockBusters
            </p>
          </div>
        </footer>
      </div>
    </SpaceBackground>
  );
}
