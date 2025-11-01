import React from 'react';
import { CloseIcon, MetamaskIcon } from './Icons';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose, onConnect }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md p-8 bg-[#1a1a1a] border border-cyan-400/20 rounded-2xl shadow-xl transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <div className="text-center">
          <h2 id="modal-title" className="text-2xl font-bold text-white mb-2">Connect your wallet</h2>
          <p className="text-gray-400 mb-8">Select your wallet from the options below.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onConnect}
            className="w-full flex items-center p-4 bg-gray-500/10 border border-gray-400/10 rounded-lg hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all duration-300"
          >
            <MetamaskIcon className="h-8 w-8 mr-4" />
            <span className="text-lg font-bold text-white">MetaMask</span>
          </button>
          {/* Add other wallet options here */}
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;