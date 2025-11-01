import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory state for MVP demo
let gridStatus = 'normal';
let activeEvent = null;
const savingsReports = [];

// Mock wallet addresses for demo
const WALLETS = {
  aiAgent: '0x1234567890123456789012345678901234567890',
  oracle: '0x0987654321098765432109876543210987654321',
  contract: '0xABCDEF1234567890ABCDEF1234567890ABCDEF12'
};

// Simulate blockchain transaction
const simulateTransaction = async (from, action) => {
  console.log(`🔗 Simulating transaction from ${from}...`);
  console.log(`   Action: ${action}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock transaction hash
  const txHash = '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  
  console.log(`✅ Transaction confirmed: ${txHash}`);
  return txHash;
};

// ===============================
// API ENDPOINTS
// ===============================

// 1. Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    wallets: WALLETS,
    contract: WALLETS.contract
  });
});

// 2. Get Grid Status
app.get('/grid-status', (req, res) => {
  res.json({
    status: gridStatus,
    activeEvent: activeEvent,
    timestamp: new Date().toISOString()
  });
});

// 3. Simulate Grid Stress Event
app.post('/simulate-stress-event', async (req, res) => {
  try {
    console.log('\n🚨 Triggering grid stress event...');
    
    const bountyPerWatt = 100; // wei per watt
    const duration = 300; // seconds
    
    console.log(`Calling triggerEvent(${bountyPerWatt}, ${duration})...`);
    
    // Simulate blockchain transaction
    const txHash = await simulateTransaction(
      WALLETS.aiAgent,
      `triggerEvent(${bountyPerWatt}, ${duration})`
    );
    
    // Update state
    gridStatus = 'STRESSED';
    activeEvent = {
      bountyPerWatt,
      duration,
      startTime: Date.now(),
      txHash
    };
    
    // Auto-expire after duration
    setTimeout(() => {
      if (gridStatus === 'STRESSED' && activeEvent?.txHash === txHash) {
        console.log('⏱️  Event duration expired, returning to normal...');
        gridStatus = 'normal';
        activeEvent = null;
      }
    }, duration * 1000);
    
    res.json({
      success: true,
      message: 'Grid stress event triggered on-chain.',
      transactionHash: txHash,
      bountyPerWatt,
      duration,
      gridStatus: 'STRESSED'
    });
    
  } catch (error) {
    console.error('❌ Error triggering stress event:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 4. Report Energy Savings
app.post('/report-savings', async (req, res) => {
  try {
    const { deviceAddress, savings } = req.body;
    
    // Validation
    if (!deviceAddress || savings === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: deviceAddress and savings'
      });
    }
    
    // Validate Ethereum address format
    if (!ethers.isAddress(deviceAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Ethereum address format'
      });
    }
    
    // Validate savings amount
    if (typeof savings !== 'number' || savings <= 0 || savings > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Savings must be a positive number between 1 and 10000 watts'
      });
    }
    
    console.log(`\n📊 Reporting savings for device ${deviceAddress}: ${savings} watts`);
    console.log(`Calling submitProofOfSaving(${deviceAddress}, ${savings})...`);
    
    // Simulate blockchain transaction
    const txHash = await simulateTransaction(
      WALLETS.oracle,
      `submitProofOfSaving(${deviceAddress}, ${savings})`
    );
    
    // Calculate reward (simplified)
    const rewardAmount = activeEvent 
      ? (savings * activeEvent.bountyPerWatt) / 1e18 // Convert wei to ETH
      : (savings * 0.001); // Default rate
    
    // Store report
    const report = {
      deviceAddress,
      savings,
      timestamp: Date.now(),
      txHash,
      reward: rewardAmount
    };
    savingsReports.push(report);
    
    // Return to normal after first report (for MVP demo flow)
    if (gridStatus === 'STRESSED') {
      console.log('✅ Savings reported, returning grid to normal...');
      gridStatus = 'normal';
      activeEvent = null;
    }
    
    res.json({
      success: true,
      message: 'Proof submitted to oracle.',
      transactionHash: txHash,
      deviceAddress,
      savings,
      reward: rewardAmount.toFixed(6),
      gridStatus
    });
    
  } catch (error) {
    console.error('❌ Error reporting savings:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 5. Get Savings History (bonus endpoint for frontend)
app.get('/savings-history', (req, res) => {
  res.json({
    success: true,
    reports: savingsReports.slice(-20).reverse() // Last 20 reports
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Aura Protocol Mock Backend Server');
  console.log('==================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log('🔗 Network: Base Sepolia (simulated)');
  console.log(`📄 Contract: ${WALLETS.contract}`);
  console.log(`🤖 AI Agent: ${WALLETS.aiAgent}`);
  console.log(`🔮 Oracle: ${WALLETS.oracle}`);
  console.log('\nEndpoints:');
  console.log('  GET  /health - Health check');
  console.log('  GET  /grid-status - Get current grid status');
  console.log('  POST /simulate-stress-event - Trigger grid stress event');
  console.log('  POST /report-savings - Submit proof of savings');
  console.log('  GET  /savings-history - Get savings reports');
  console.log('==================================\n');
});