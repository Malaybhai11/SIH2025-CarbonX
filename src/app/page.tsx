import React  from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage(){

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 color">Welcome to Our Project CarbonX</h1>
        <p className="text-lg mb-8">Background:</p>
        <p className="text-md mb-8 max-w-2xl mx-auto">
          Blue carbon ecosystem restoration is gaining importance in India's climate strategy. However, there is no decentralized, verifiable Monitoring, Reporting, and Verification (MRV) system that ensures transparency, accuracy, and carbon credit generation.
        </p>
        <Link href="/about" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Learn More
        </Link>
      </div>
    </div>
  )
}