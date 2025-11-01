import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import LiveDashboardSection from './components/LiveDashboardSection';
import RewardsSection from './components/RewardsSection';
import WhyAuraSection from './components/WhyAuraSection';
import Footer from './components/Footer';
import WalletConnectModal from './components/WalletConnectModal';
import DeviceOrderModal from './components/DeviceOrderModal';
import DebugPanel from './components/DebugPanel';
import { TerminalIcon } from './components/Icons';

// Data structure interfaces
export interface DashboardData {
  carbonIntensity: number;
  rewardRate: number;
  gridStatus: 'Stable' | 'Stressed';
  peakerAvoided: number;
}

export interface Transaction {
  id: number;
  type: string;
  amount: string;
  time: string;
  status: 'Confirmed' | 'Completed' | 'Verifying...';
}

export interface ChartDataPoint {
  time: string;
  consumption: number;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
}

export type TimeFilter = '1h' | '24h' | '7d' | '30d' | 'all';

// Initial Data with more realistic reward amounts and granular time
const initialTransactions: Transaction[] = [
    { id: 14, type: 'Grid Balancing Reward', amount: '+ 0.05 USDC', time: '30 minutes ago', status: 'Verifying...' },
    { id: 13, type: 'Grid Balancing Reward', amount: '+ 0.11 USDC', time: '2 hours ago', status: 'Confirmed' },
    { id: 12, type: 'Grid Balancing Reward', amount: '+ 0.21 USDC', time: '1 day ago', status: 'Confirmed' },
    { id: 11, type: 'Grid Balancing Reward', amount: '+ 0.15 USDC', time: '1 day ago', status: 'Confirmed' },
    { id: 10, type: 'Grid Balancing Reward', amount: '+ 0.32 USDC', time: '2 days ago', status: 'Confirmed' },
    { id: 9, type: 'Withdrawal', amount: '- 20.00 USDC', time: '2 days ago', status: 'Completed' },
    { id: 8, type: 'Grid Balancing Reward', amount: '+ 0.18 USDC', time: '3 days ago', status: 'Confirmed' },
    { id: 7, type: 'Grid Balancing Reward', amount: '+ 0.25 USDC', time: '3 days ago', status: 'Confirmed' },
    { id: 6, type: 'Grid Balancing Reward', amount: '+ 0.12 USDC', time: '4 days ago', status: 'Confirmed' },
    { id: 5, type: 'Grid Balancing Reward', amount: '+ 0.38 USDC', time: '8 days ago', status: 'Confirmed' },
    { id: 4, type: 'Grid Balancing Reward', amount: '+ 0.29 USDC', time: '15 days ago', status: 'Confirmed' },
    { id: 3, type: 'Withdrawal', amount: '- 15.00 USDC', time: '25 days ago', status: 'Completed' },
    { id: 2, type: 'Grid Balancing Reward', amount: '+ 0.17 USDC', time: '32 days ago', status: 'Confirmed' },
    { id: 1, type: 'Grid Balancing Reward', amount: '+ 0.24 USDC', time: '40 days ago', status: 'Confirmed' },
];

const generateInitialChartData = (): ChartDataPoint[] => {
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const hour = new Date();
    hour.setHours(hour.getHours() - i);
    data.push({
      time: hour.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false }),
      consumption: Math.random() * 50 + 150,
    });
  }
  return data;
};

// Helper function to parse time strings like "X days ago" into hours.
const parseTimeAgo = (time: string): number => {
    const parts = time.split(' ');
    if (parts.length < 2) return Infinity; // Return a large number for invalid formats
    const value = parseInt(parts[0], 10);
    if (isNaN(value)) return Infinity;

    if (parts[1].startsWith('minute')) {
        return value / 60;
    }
    if (parts[1].startsWith('hour')) {
        return value;
    }
    if (parts[1].startsWith('day')) {
        return value * 24;
    }
    return Infinity; // Fallback for unhandled units
};


const App: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    carbonIntensity: 185,
    rewardRate: 0.22,
    gridStatus: 'Stable',
    peakerAvoided: 3,
  });
  
  const [chartData, setChartData] = useState<ChartDataPoint[]>(generateInitialChartData());
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [balance, setBalance] = useState<number>(34.58);
  const [isEventActive, setIsEventActive] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false); // State for the device order modal
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    isConnecting: false,
  });
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  
  // State for debug panel
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  
  // Handlers for the device order modal
  const handleOpenDeviceModal = () => setIsDeviceModalOpen(true);
  const handleCloseDeviceModal = () => setIsDeviceModalOpen(false);

  const handleFilterChange = (filter: TimeFilter) => setTimeFilter(filter);

  // Memoized filtering logic updated to handle new hour-based filters.
  const filteredTransactions = useMemo(() => {
    if (timeFilter === 'all') return transactions;
    
    let limitInHours: number;
    switch (timeFilter) {
      case '1h':
        limitInHours = 1;
        break;
      case '24h':
        limitInHours = 24;
        break;
      case '7d':
        limitInHours = 7 * 24;
        break;
      case '30d':
        limitInHours = 30 * 24;
        break;
      default:
        return transactions;
    }

    return transactions.filter(tx => {
      const hoursAgo = parseTimeAgo(tx.time);
      return hoursAgo <= limitInHours;
    });
  }, [transactions, timeFilter]);

  const handleConnectWallet = () => {
    handleCloseModal();
    setWallet(prev => ({ ...prev, isConnecting: true }));
    addLog('Connecting to wallet...');
    setTimeout(() => {
      const mockAddress = '0x1a2b...c3d4';
      setWallet({ isConnected: true, address: mockAddress, isConnecting: false });
      addLog(`Wallet connected: ${mockAddress}`);
    }, 2000);
  };

  const handleDisconnectWallet = () => {
    setWallet({ isConnected: false, address: null, isConnecting: false });
    addLog('Wallet disconnected.');
  };

  // Handler for device order submission.
  const handleDeviceOrderSubmit = (details: { name: string; address: string; email: string; phone: string }) => {
    addLog(`Device order submitted for ${details.name}. Address: ${details.address}`);
    handleCloseDeviceModal();
    // Here you would typically show a success notification to the user.
  };

  // API Configuration
  const API_URL = process.env.VITE_API_URL || 'http://localhost:3001';

  // API Helper Functions
  const apiCall = async (endpoint: string, options?: RequestInit) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Poll grid status periodically
  useEffect(() => {
    const checkGridStatus = async () => {
      try {
        const data = await apiCall('/grid-status');
        if (data.status === 'STRESSED') {
          setDashboardData(prev => ({ ...prev, gridStatus: 'Stressed', rewardRate: 0.78 }));
          setIsEventActive(true);
        } else {
          setDashboardData(prev => ({ ...prev, gridStatus: 'Stable', rewardRate: 0.22 }));
          setIsEventActive(false);
        }
      } catch (error) {
        console.error('Failed to fetch grid status:', error);
      }
    };

    checkGridStatus();
    const interval = setInterval(checkGridStatus, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Backend functions
  const simulateGridStress = async () => {
    try {
      addLog('Triggering Grid Stress Event via API...');
      setIsSubmitting(true);
      
      const response = await apiCall('/simulate-stress-event', {
        method: 'POST',
      });
      
      if (response.success) {
        addLog(`Grid stress event triggered! TX: ${response.transactionHash.substring(0, 10)}...`);
        setDashboardData(prev => ({ ...prev, gridStatus: 'Stressed', rewardRate: 0.78 }));
        setIsEventActive(true);
        addLog('Grid status set to STRESSED. Reward rate increased.');
      } else {
        addLog(`Error: ${response.message}`);
      }
    } catch (error) {
      addLog(`Failed to trigger stress event: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reportSavings = async (address: string, savings: number) => {
    try {
      addLog(`Reporting savings of ${savings}W for device ${address}...`);
      setIsSubmitting(true);
      
      const response = await apiCall('/report-savings', {
        method: 'POST',
        body: JSON.stringify({ deviceAddress: address, savings }),
      });
      
      if (response.success) {
        const reward = parseFloat(response.reward) * 1000; // Convert to USDC scale
        const newTransaction: Transaction = {
          id: Date.now(),
          type: 'Grid Balancing Reward',
          amount: `+ ${reward.toFixed(2)} USDC`,
          time: 'Just now',
          status: 'Verifying...',
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
        setBalance(prev => prev + reward);
        addLog(`Savings reported! TX: ${response.transactionHash.substring(0, 10)}...`);
        addLog(`User rewarded ${reward.toFixed(2)} USDC.`);
        
        // Update transaction status after confirmation
        setTimeout(() => {
          setTransactions(prev => 
            prev.map(tx => tx.id === newTransaction.id ? {...tx, status: 'Confirmed'} : tx)
          );
          addLog(`Transaction confirmed.`);
        }, 3000);
      } else {
        addLog(`Error: ${response.message}`);
      }
    } catch (error) {
      addLog(`Failed to report savings: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Simulate live chart data updates
    const interval = setInterval(() => {
      setChartData(prevData => {
        const newData = prevData.slice(1);
        const lastTime = newData[newData.length - 1].time;
        const newHour = new Date();
        newHour.setHours(parseInt(lastTime.split(':')[0]) + 1);
        
        return [
          ...newData,
          {
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', hour12: false }),
            consumption: Math.random() * 50 + 150,
          },
        ];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="bg-[#131313] text-gray-100">
      <Header wallet={wallet} onConnect={handleOpenModal} onDisconnect={handleDisconnectWallet} />
      <main>
        <HeroSection wallet={wallet} onConnect={handleOpenModal} onGetDevice={handleOpenDeviceModal} />
        <HowItWorksSection />
        <LiveDashboardSection data={dashboardData} chartData={chartData} />
        <RewardsSection balance={balance} transactions={filteredTransactions} activeFilter={timeFilter} onFilterChange={handleFilterChange} />
        <WhyAuraSection />
      </main>
      <Footer />
      <WalletConnectModal isOpen={isModalOpen} onClose={handleCloseModal} onConnect={handleConnectWallet} />
      <DeviceOrderModal isOpen={isDeviceModalOpen} onClose={handleCloseDeviceModal} onSubmit={handleDeviceOrderSubmit} />
      <button
        onClick={() => setIsDebugPanelOpen(prev => !prev)}
        className="fixed bottom-4 left-4 z-50 bg-cyan-500/20 text-cyan-300 p-3 rounded-full hover:bg-cyan-500/30 transition-colors"
        aria-label="Toggle Debug Panel"
      >
        <TerminalIcon className="h-6 w-6" />
      </button>
      {isDebugPanelOpen && (
        <DebugPanel
          onClose={() => setIsDebugPanelOpen(false)}
          onSimulateStress={simulateGridStress}
          onReportSavings={reportSavings}
          logs={debugLogs}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default App;
