import React from 'react';
import { WalletIcon, GlobeIcon, EnergyIcon } from './Icons';
import { Transaction, TimeFilter } from '../App';

interface RewardsProps {
  balance: number;
  transactions: Transaction[];
  activeFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
}

const getStatusStyles = (status: Transaction['status']) => {
  switch (status) {
    case 'Confirmed':
      return { ring: 'ring-gray-800', bg: 'bg-green-500/20', icon: '⚡' };
    case 'Completed':
      return { ring: 'ring-gray-800', bg: 'bg-blue-500/20', icon: '💸' };
    case 'Verifying...':
      return { ring: 'ring-yellow-500/50', bg: 'bg-yellow-500/20 animate-pulse', icon: '🔗' };
    default:
      return { ring: 'ring-gray-800', bg: 'bg-gray-500/20', icon: '?' };
  }
};

const FilterButton: React.FC<{
  label: string;
  filter: TimeFilter;
  activeFilter: TimeFilter;
  onClick: (filter: TimeFilter) => void;
}> = ({ label, filter, activeFilter, onClick }) => (
  <button
    onClick={() => onClick(filter)}
    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
      activeFilter === filter
        ? 'bg-cyan-400/20 text-cyan-300'
        : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
    }`}
  >
    {label}
  </button>
);


const RewardsSection: React.FC<RewardsProps> = ({ balance, transactions, activeFilter, onFilterChange }) => {
  return (
    <section className="py-20 sm:py-32 bg-[#131313]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Your Rewards</h2>
          <p className="mt-4 text-lg text-gray-400">Track your earnings and environmental impact.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="bg-gray-500/5 border border-gray-400/10 rounded-2xl p-6">
              <h3 className="text-gray-400 mb-2">Total Balance</h3>
              <p className="text-4xl font-extrabold text-cyan-400">{balance.toFixed(2)} <span className="text-2xl">USDC</span></p>
              <div className="flex gap-4 mt-6">
                <button className="flex-1 px-4 py-2 text-sm font-bold bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 rounded-full hover:bg-cyan-400/20 transition-colors">Claim</button>
                <button className="flex-1 px-4 py-2 text-sm font-bold bg-white/10 text-white border border-white/20 rounded-full hover:bg-white/20 transition-colors">Withdraw</button>
              </div>
            </div>
            <div className="bg-gray-500/5 border border-gray-400/10 rounded-2xl p-6">
              <h3 className="text-gray-400 mb-4">Lifetime Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3"><EnergyIcon className="h-5 w-5 text-cyan-400"/><span>Energy Saved</span></div>
                  <span className="font-bold">78.2 kWh</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3"><GlobeIcon className="h-5 w-5 text-cyan-400"/><span>CO₂ Offset</span></div>
                  <span className="font-bold">14.4 kg</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-gray-500/5 border border-gray-400/10 rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                <div className="flex items-center gap-2">
                    <FilterButton label="1H" filter="1h" activeFilter={activeFilter} onClick={onFilterChange} />
                    <FilterButton label="24H" filter="24h" activeFilter={activeFilter} onClick={onFilterChange} />
                    <FilterButton label="7D" filter="7d" activeFilter={activeFilter} onClick={onFilterChange} />
                    <FilterButton label="30D" filter="30d" activeFilter={activeFilter} onClick={onFilterChange} />
                    <FilterButton label="All" filter="all" activeFilter={activeFilter} onClick={onFilterChange} />
                </div>
            </div>
             {/* Removed pr-2 and -mr-2 to make the styled scrollbar visible */}
             <div className="flex-1 overflow-y-auto h-96 [mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)]">
              {/* Add padding-top to create space from the header and fix icon alignment from the top */}
              <ul role="list" className="flow-root pl-2 pt-4">
                {transactions.length > 0 ? transactions.map((tx, txIdx) => {
                  const styles = getStatusStyles(tx.status);
                  return (
                    <li key={tx.id}>
                      <div className="relative pb-8">
                        {txIdx !== transactions.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-700" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3 items-start">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ${styles.ring} ${styles.bg}`}>
                               {styles.icon}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-300">{tx.type}</p>
                                <p className={`text-sm font-bold ${tx.amount.startsWith('+') ? 'text-green-400' : tx.amount.startsWith('-') ? 'text-blue-400' : 'text-yellow-400'}`}>{tx.amount}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{tx.time}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                }) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>No transactions in this period.</p>
                    </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RewardsSection;
