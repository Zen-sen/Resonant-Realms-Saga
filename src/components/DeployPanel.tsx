import { useState } from 'react';
import { NETWORKS, POLYGON_AMOY_FAUCET } from '../config/contracts';

const STORAGE_KEY = 'resonant_realms_pk';

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

export function DeployPanel() {
  const [privateKey, setPrivateKey] = useState<string>(() => localStorage.getItem(STORAGE_KEY) || '');
  const [status, setStatus] = useState<string>('Ready');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const savePrivateKey = () => {
    if (privateKey.trim()) {
      localStorage.setItem(STORAGE_KEY, privateKey.trim());
      addLog('Private key saved securely in browser');
      setStatus('Ready to deploy!');
    }
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
      addLog('Switched to Polygon Amoy');
      return true;
    } catch (switchError: unknown) {
      const err = switchError as { code?: number };
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORKS.polygon_amoy],
          });
          addLog('Added Polygon Amoy network');
          return true;
        } catch {
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
        setStatus(`Connected: ${accounts[0].slice(0, 6)}...`);
        addLog(`Wallet: ${accounts[0].slice(0, 10)}...`);
        return true;
      }
      return false;
    } catch {
      addLog('Connection rejected');
      return false;
    }
  };

  const handleSetup = async () => {
    setLogs([]);
    setStatus('Setting up...');
    
    addLog('1. Connecting to MetaMask...');
    const connected = await connectMetaMask();
    if (!connected) return;

    addLog('2. Switching to Polygon Amoy...');
    await switchToPolygonAmoy();

    addLog('3. Setup complete!');
    addLog('Paste private key below if deploying via CLI');
    setStatus('Ready!');
  };

  return (
    <div style={{
      padding: '1.5rem',
      border: '1px solid #06b6d4',
      borderRadius: '12px',
      background: 'rgba(6, 182, 212, 0.05)',
      maxWidth: '500px',
      margin: '1rem auto',
    }}>
      <h2 style={{ color: '#06b6d4', marginBottom: '1rem' }}>Deploy to Polygon Amoy</h2>
      
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
          marginBottom: '1rem',
        }}
      >
        1. Setup MetaMask + Polygon Amoy
      </button>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          2. Private Key (for deployment):
        </label>
        <input
          type="password"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="0x..."
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
          }}
        />
        <button
          onClick={savePrivateKey}
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#374151',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          Save Key
        </button>
      </div>

      <div style={{ 
        padding: '1rem', 
        background: 'rgba(0,0,0,0.3)', 
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: '#d1d5db',
      }}>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#10b981' }}>Status:</strong> {status}
        </p>
        
        <p style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#f59e0b' }}>Need MATIC?</strong><br/>
          <a 
            href={POLYGON_AMOY_FAUCET} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#06b6d4' }}
          >
            faucet.polygon.technology
          </a>
        </p>

        <p style={{ marginBottom: '0', fontFamily: 'monospace', fontSize: '0.75rem' }}>
          <strong>Deploy:</strong><br/>
          npm run deploy:pi
        </p>
      </div>

      {logs.length > 0 && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          color: '#10b981',
          maxHeight: '150px',
          overflowY: 'auto',
        }}>
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: '0.25rem' }}>{log}</div>
          ))}
        </div>
      )}
    </div>
  );
}
