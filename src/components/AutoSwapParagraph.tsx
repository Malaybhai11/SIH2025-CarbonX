"use client";
import { useEffect, useState } from "react";

export default function AutoSwapParagraphWithDots() {
  const paragraphs = [
    `Join the revolution in carbon credit management. Our blockchain-powered platform transforms how we verify, trade, and restore our planet's precious ecosystems through cutting-edge technology and community-driven environmental action.`,
    `Empower your business and community with transparent, AI-driven carbon credit solutions. CarbonX ensures every action for the planet is verified, impactful, and rewarded.`,
    `Experience the next generation of environmental stewardship—secure, scalable, and built for a sustainable future with CarbonX.`
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % paragraphs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [paragraphs.length]);

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto text-center space-y-4 p-4">
      {/* Paragraphs */}
      <div className="relative w-full min-h-[80px]"> 
        {paragraphs.map((text, i) => (
          <p
            key={i}
            className={`absolute w-full font-semibold transition-all duration-700
              [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]
              ${i === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          >
            {text}
          </p>
        ))}
      </div>

      {/* Dots */}
      <div className="flex absolute mt-65 space-x-2 justify-center">
        {paragraphs.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition-colors duration-500 
              ${i === index ? "bg-blue-600" : "bg-gray-400"}`}
          ></span>
        ))}
      </div>
    </div>
  );
}
