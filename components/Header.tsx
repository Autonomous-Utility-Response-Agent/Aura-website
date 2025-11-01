import React, { useState, useEffect } from 'react';
import { WalletIcon, LogoIcon } from './Icons';
import { WalletState } from '../App';

interface HeaderProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ wallet, onConnect, onDisconnect }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderAuthButtons = () => {
    if (wallet.isConnecting) {
      return (
        <button 
          disabled
          className="flex items-center space-x-2 px-4 py-2 text-sm font-bold bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 rounded-full opacity-50 cursor-not-allowed"
        >
          <WalletIcon className="h-5 w-5" />
          <span>Connecting...</span>
        </button>
      );
    }

    if (wallet.isConnected && wallet.address) {
      return (
        <button 
          onClick={onDisconnect}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-bold bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 rounded-full hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105"
        >
          <WalletIcon className="h-5 w-5" />
          <span>{`${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`}</span>
        </button>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        <button 
          onClick={onConnect}
          className="px-4 py-2 text-sm font-bold bg-white/10 text-white border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
        >
          Login
        </button>
        <button 
          onClick={onConnect}
          className="px-4 py-2 text-sm font-bold text-gray-900 bg-cyan-400 rounded-full hover:bg-cyan-300 transition-all duration-300 transform hover:scale-105"
        >
          Sign Up
        </button>
      </div>
    );
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#131313]/80 backdrop-blur-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="flex items-center space-x-2">
            <LogoIcon className="h-8 w-8 text-cyan-400" />
            <span className="text-2xl font-extrabold text-white">Aura</span>
          </a>
          <nav>
            {renderAuthButtons()}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
