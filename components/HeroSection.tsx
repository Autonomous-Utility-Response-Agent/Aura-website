import React from 'react';
import { WalletState } from '../App';

interface HeroProps {
  wallet: WalletState;
  onConnect: () => void;
  onGetDevice: () => void;
}

const HeroSection: React.FC<HeroProps> = ({ wallet, onConnect, onGetDevice }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
      <div className="absolute inset-0 bg-grid-cyan-500/10 [mask-image:linear-gradient(to_bottom,white_0%,transparent_100%)]"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4">
          Earn money by <span className="text-cyan-400">saving the grid.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-8">
          Aura automatically reduces your energy consumption during peak grid load and instantly rewards you with USDC.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!wallet.isConnected && (
            <button 
              onClick={onConnect}
              disabled={wallet.isConnecting}
              className="w-full sm:w-auto px-8 py-3 text-base font-bold text-gray-900 bg-cyan-400 rounded-full hover:bg-cyan-300 transition-all duration-300 transform hover:scale-105 disabled:opacity-75 disabled:cursor-not-allowed disabled:scale-100"
            >
              {wallet.isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
          )}
          <button 
            onClick={onGetDevice}
            className="w-full sm:w-auto px-8 py-3 text-base font-bold bg-white/10 text-white border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            Get Aura Device
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
