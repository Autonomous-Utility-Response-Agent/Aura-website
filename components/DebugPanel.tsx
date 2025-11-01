import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, TerminalIcon } from './Icons';

interface DebugPanelProps {
  onClose: () => void;
  onSimulateStress: () => Promise<void>;
  onReportSavings: (address: string, savings: number) => Promise<void>;
  logs: string[];
  isSubmitting: boolean;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ onClose, onSimulateStress, onReportSavings, logs, isSubmitting }) => {
  const [deviceAddress, setDeviceAddress] = useState('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0');
  const [savings, setSavings] = useState('50');
  const logContainerRef = useRef<HTMLDivElement>(null);

  const handleReport = () => {
    const savingsNum = parseInt(savings, 10);
    if (deviceAddress && !isNaN(savingsNum)) {
      onReportSavings(deviceAddress, savingsNum);
    } else {
      alert('Please enter a valid address and savings amount.');
    }
  };

  useEffect(() => {
    if (logContainerRef.current) {
        logContainerRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
      <div className="bg-[#1a1a1a]/80 backdrop-blur-lg border border-cyan-400/30 rounded-2xl shadow-2xl text-white overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-400/20">
          <div className="flex items-center space-x-2">
            <TerminalIcon className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-bold">Backend Control</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h4 className="font-bold mb-2">Trigger Grid Event</h4>
            <button
              onClick={onSimulateStress}
              disabled={isSubmitting}
              className="w-full px-4 py-2 text-sm font-bold bg-red-500/20 text-red-300 border border-red-400/30 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Working...' : 'Simulate Stress Event'}
            </button>
          </div>
          
          <div className="border-t border-gray-400/20 pt-4">
            <h4 className="font-bold mb-2">Report Savings</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Device Address (0x...)"
                value={deviceAddress}
                onChange={(e) => setDeviceAddress(e.target.value)}
                className="w-full px-3 py-2 bg-gray-500/10 border border-gray-400/20 rounded-lg text-sm placeholder-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Savings (watts)"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                className="w-full px-3 py-2 bg-gray-500/10 border border-gray-400/20 rounded-lg text-sm placeholder-gray-500 focus:ring-1 focus:ring-cyan-400 focus:outline-none"
              />
              <button
                onClick={handleReport}
                disabled={isSubmitting}
                className="w-full px-4 py-2 text-sm font-bold bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 rounded-lg hover:bg-cyan-400/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Working...' : 'Submit Proof of Savings'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-black/20 p-4 border-t border-gray-400/20 mt-auto">
          <h4 className="font-bold text-sm mb-2">Logs</h4>
          <div ref={logContainerRef} className="h-32 overflow-y-auto pr-2 text-xs font-mono space-y-1 text-gray-400">
            {logs.length === 0 && <p>&gt; Waiting for actions...</p>}
            {logs.map((log, index) => (
              <p key={index} className="whitespace-pre-wrap break-words">{`> ${log}`}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
