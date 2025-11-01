
import React from 'react';
import { LeafIcon, UsersIcon, RewardIcon } from './Icons';

const benefits = [
  {
    icon: <LeafIcon className="h-8 w-8 text-cyan-400" />,
    title: 'Lower Emissions',
    description: 'By reducing reliance on peaker plants, Aura directly contributes to a cleaner, more sustainable energy grid for everyone.',
  },
  {
    icon: <UsersIcon className="h-8 w-8 text-cyan-400" />,
    title: 'Savings for All',
    description: 'A less stressed grid means lower operational costs for utility providers, translating to potential savings on energy bills.',
  },
  {
    icon: <RewardIcon className="h-8 w-8 text-cyan-400" />,
    title: 'Instant Web3 Rewards',
    description: 'Leveraging blockchain technology, we provide transparent, immediate, and secure USDC rewards for your contribution.',
  },
];

const WhyAuraSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-32 bg-[#1a1a1a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Why Aura?</h2>
          <p className="mt-4 text-lg text-gray-400">Join a movement that benefits your wallet and the world.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-gray-500/5 border border-gray-400/10 rounded-2xl p-8 transition-all duration-300 hover:border-cyan-400/30">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-cyan-400/10 mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyAuraSection;
