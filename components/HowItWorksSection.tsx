
import React from 'react';
import { AIIcon, ContractIcon, DeviceIcon, ChainlinkIcon, RewardIcon } from './Icons';

const steps = [
  {
    icon: <AIIcon className="h-10 w-10 text-cyan-400" />,
    title: 'AI Detects Grid Stress',
    description: 'Our AI constantly monitors the grid and identifies moments of high energy demand.',
  },
  {
    icon: <ContractIcon className="h-10 w-10 text-cyan-400" />,
    title: 'Smart Contract Initiates',
    description: 'A secure smart contract is triggered, locking in rewards for participants.',
  },
  {
    icon: <DeviceIcon className="h-10 w-10 text-cyan-400" />,
    title: 'IoT Device Responds',
    description: 'Your Aura device momentarily reduces consumption from non-essential appliances.',
  },
  {
    icon: <ChainlinkIcon className="h-10 w-10 text-cyan-400" />,
    title: 'Chainlink Confirms',
    description: 'Chainlink oracles provide decentralized validation of the energy reduction event.',
  },
  {
    icon: <RewardIcon className="h-10 w-10 text-cyan-400" />,
    title: 'Instant USDC Reward',
    description: 'USDC is streamed directly to your wallet the moment the event is confirmed.',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-32 bg-[#131313]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How Aura Works</h2>
          <p className="mt-4 text-lg text-gray-400">A seamless, automated process from grid-saving to rewards.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-500/5 border border-gray-400/10 rounded-2xl hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-cyan-400/10 mb-6">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
