import { useState } from 'react';
import { NETWORKS, POLYGON_AMOY_FAUCET } from '../config/contracts';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      providers?: Array<{
        isMetaMask?: boolean;
        request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      }>;
    };
  }
}

export function DeployButton() {
  const [status, setStatus] = useState<string>('Ready');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-5), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const switchToPolygonAmoy = async () => {
    if (!window.ethereum) {
      setStatus('Install MetaMask first!');
      return false;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORKS.polygon_amoy.chainId }],
      });
      addLog('Switched to Polygon Amoy!');
      return true;
    } catch (switchError: unknown) {
      const err = switchError as { code?: number };
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORKS.polygon_amoy],
          });
          addLog('Added Polygon Amoy network!');
          return true;
        } catch (addError) {
          addLog('Failed to add network');
          return false;
        }
      }
      addLog('Failed to switch network');
      return false;
    }
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      setStatus('Install MetaMask!');
      return false;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];
      
      if (accounts.length > 0) {
        setStatus(`Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
        addLog(`Wallet: ${accounts[0]}`);
        return true;
      }
      return false;
    } catch (err) {
      addLog('Connection rejected');
      return false;
    }
  };

  const handleSetup = async () => {
    setLogs([]);
    setStatus('Setting up...');
    
    addLog('Step 1: Connecting to MetaMask...');
    const connected = await connectMetaMask();
    if (!connected) return;

    addLog('Step 2: Switching to Polygon Amoy...');
    const switched = await switchToPolygonAmoy();
    if (!switched) return;

    setStatus('Ready! Open terminal to deploy:');
    addLog('Run in terminal: npm run deploy:pi');
  };

  return (
    <div style={{
      marginTop: '1rem',
      padding: '1rem',
      border: '1px solid #06b6d4',
      borderRadius: '8px',
      background: 'rgba(6, 182, 212, 0.05)',
    }}>
      <h3 style={{ color: '#06b6d4', marginBottom: '0.5rem' }}>Deploy to Polygon Amoy</h3>
      
      <button
        onClick={handleSetup}
        style={{
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #06b6d4, #10b981)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          width: '100%',
        }}
      >
        1. Setup MetaMask + Polygon Amoy
      </button>

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#9ca3af' }}>
        <p><strong>Status:</strong> {status}</p>
        
        <p style={{ marginTop: '0.5rem' }}>
          <strong>Need test MATIC?</strong><br/>
          <a 
            href={POLYGON_AMOY_FAUCET} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#06b6d4' }}
          >
            {POLYGON_AMOY_FAUCET}
          </a>
        </p>

        <p style={{ marginTop: '0.5rem' }}>
          <strong>Deploy command:</strong><br/>
          <code style={{ fontSize: '0.7rem' }}>npm run deploy:pi</code>
        </p>
      </div>

      {logs.length > 0 && (
        <div style={{
          marginTop: '1rem',
          padding: '0.5rem',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontFamily: 'monospace',
          color: '#10b981',
        }}>
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
        </div>
      )}
    </div>
  );
}
