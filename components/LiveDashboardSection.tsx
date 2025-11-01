
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EnergyIcon, EmissionsIcon, GridIcon, LeafIcon } from './Icons';
import { DashboardData, ChartDataPoint } from '../App';

interface LiveDashboardProps {
  data: DashboardData;
  chartData: ChartDataPoint[];
}

const LiveDashboardSection: React.FC<LiveDashboardProps> = ({ data, chartData }) => {

  const Card: React.FC<{ icon: React.ReactNode; title: string; value: string | number; unit?: string; statusColor?: string; isStressed?: boolean }> = ({ icon, title, value, unit, statusColor, isStressed }) => (
    <div className={`bg-gray-500/5 border border-gray-400/10 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${isStressed ? 'border-red-400/40 bg-red-500/5' : ''}`}>
      <div className="flex items-center space-x-3 mb-4">
        {icon}
        <h3 className="text-gray-400 font-medium">{title}</h3>
      </div>
      <div>
        <span className={`text-3xl font-extrabold transition-colors duration-300 ${statusColor || 'text-white'}`}>{value}</span>
        {unit && <span className="ml-2 text-gray-400">{unit}</span>}
      </div>
    </div>
  );

  return (
    <section className="py-20 sm:py-32 bg-[#1a1a1a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Live Grid Dashboard</h2>
          <p className="mt-4 text-lg text-gray-400">Real-time data powered by Aura & our partners.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card icon={<EmissionsIcon className="h-6 w-6 text-cyan-400" />} title="Carbon Intensity" value={data.carbonIntensity} unit="gCO₂eq/kWh" />
          <Card icon={<EnergyIcon className="h-6 w-6 text-cyan-400" />} title="Current Reward" value={`$${data.rewardRate.toFixed(2)}`} unit="/ kWh" isStressed={data.gridStatus === 'Stressed'}/>
          <Card icon={<GridIcon className="h-6 w-6 text-cyan-400" />} title="Grid Status" value={data.gridStatus} statusColor={data.gridStatus === 'Stable' ? 'text-green-400' : 'text-red-400'} isStressed={data.gridStatus === 'Stressed'}/>
          <Card icon={<LeafIcon className="h-6 w-6 text-cyan-400" />} title="Peaker Plants Avoided" value={data.peakerAvoided} unit="Today" />
        </div>
        <div className="h-96 w-full bg-gray-500/5 border border-gray-400/10 rounded-2xl p-4 sm:p-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
               <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
              <XAxis dataKey="time" stroke="#888" interval="preserveStartEnd" ticks={chartData.map(d=>d.time).filter((_,i) => i % 4 === 0)} />
              <YAxis stroke="#888" domain={['dataMin - 20', 'dataMax + 20']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20, 20, 20, 0.8)',
                  borderColor: '#00f2ff',
                  color: '#f5f5f5'
                }}
                itemStyle={{ color: '#f5f5f5' }}
                labelStyle={{ color: '#888' }}
              />
              <Area type="monotone" dataKey="consumption" stroke="#00f2ff" strokeWidth={2} fillOpacity={1} fill="url(#colorConsumption)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default LiveDashboardSection;
