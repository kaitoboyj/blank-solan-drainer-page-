import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Gift, Wallet } from 'lucide-react';

/**
 * This page is used to collect donations for charity.
 * All proceeds go to supporting humanitarian causes around the world.
 * Your generosity helps make a difference in people's lives.
 */

const GoRuLocal = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-blue-900 to-blue-700">
      {/* Header */}
      <div className="relative z-20 container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="text-red-500" size={24} />
          <span className="font-bold text-white">Charity Donations</span>
        </div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-8">
        {/* Charity Banner */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Make a Difference Today</h1>
          <p className="text-white/80 max-w-lg mx-auto">Your donation helps provide essential services to those in need around the world.</p>
        </div>
        
        {/* Main Donation Interface */}
        <div className="flex justify-center items-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center text-white">Donate</h2>
            
            {/* Donation Form */}
            <div className="space-y-4">
              {/* From Token */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Your Donation</span>
                  <span className="text-sm text-white/70">Balance: 0.0</span>
                </div>
                <div className="flex items-center">
                  <input 
                    type="number" 
                    placeholder="0.0" 
                    className="bg-transparent text-xl font-medium focus:outline-none flex-1 text-white" 
                  />
                  <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 text-white">
                    <span>SOL</span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 8.5L2 4.5H10L6 8.5Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Donation Impact */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Your Impact</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="text-yellow-300" size={20} />
                    <span className="text-white">Meals Provided</span>
                  </div>
                  <span className="text-white font-bold">0</span>
                </div>
              </div>
              
              {/* Donation Button */}
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors">
                <Heart className="mr-2" size={18} />
                Donate Now
              </Button>
              
              {/* Donation Options */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">$5</Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">$10</Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">$25</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Charity Impact Stats */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-4 text-center">Your Donation Makes a Difference</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <Gift className="text-yellow-300 mb-2" size={24} />
              <p className="text-white font-bold">100+</p>
              <p className="text-white/70 text-sm">Families Helped</p>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="text-red-500 mb-2" size={24} />
              <p className="text-white font-bold">50+</p>
              <p className="text-white/70 text-sm">Communities</p>
            </div>
            <div className="flex flex-col items-center">
              <Wallet className="text-green-400 mb-2" size={24} />
              <p className="text-white font-bold">$10K+</p>
              <p className="text-white/70 text-sm">Raised</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-white/60">
          <p>All donations are securely processed on the Solana blockchain</p>
          <p className="mt-1">© 2023 Charity Donations. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default GoRuLocal;