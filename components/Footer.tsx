
import React from 'react';
import { ChainlinkLogo, ElectricityMapsLogo, GitHubIcon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#131313] border-t border-gray-400/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex space-x-6 text-gray-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">Docs</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          <div className="flex items-center space-x-4">
             <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <GitHubIcon className="h-6 w-6" />
             </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-400/10 flex flex-col sm:flex-row justify-center items-center text-center gap-4 text-xs text-gray-500">
          <span>Powered by</span>
          <div className="flex items-center gap-4">
            <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
              <ChainlinkLogo className="h-5" />
              Chainlink
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
              <ElectricityMapsLogo className="h-5" />
              Electricity Maps
            </a>
          </div>
        </div>
         <p className="text-center text-xs text-gray-600 mt-8">&copy; {new Date().getFullYear()} Aura Protocol. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
