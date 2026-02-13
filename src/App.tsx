import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { LifterExperiment } from './components/LifterExperiment';

/**
 * @component App
 * The high-level neural interface for Resonant Realms.
 * Handles Diamond Stone connection and Genesis Experiment routing.
 */
function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>('');
  const [showExperiment, setShowExperiment] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const addLog = useCallback((msg: string) => {
    console.log(`[DEBUG] ${msg}`);
    setDebugLog(prev => [...prev.slice(-10), msg]);
  }, []);

  const handleMintSuccess = () => {
    alert('🎉 ASCENSION COMPLETE! ǃKaggen (Tribe 0) eligibility minted.');
  };

  /**
   * The Ritual of Connection: Linking the browser to the Diamond Stone.
   * Handles multi-provider conflicts (e.g. TronLink vs MetaMask).
   */
  const connectWallet = useCallback(async (isAuto = false) => {
    if (isConnecting) return;
    setIsConnecting(true);

    if (!isAuto) addLog("--- Start Connection Ritual ---");

    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      if (!isAuto) {
        addLog("❌ Error: No ethereum provider detected.");
        alert('Please install MetaMask or use a compatible Pi Wallet browser.');
      }
      setIsConnecting(false);
      return;
    }

    // Identify the true resonance (MetaMask/Pi Wallet)
    let selectedProvider = ethereum;
    if (ethereum.providers && Array.isArray(ethereum.providers)) {
      selectedProvider = ethereum.providers.find((p: any) => p.isMetaMask) || ethereum.providers[0];
      if (!isAuto) addLog(`Detected ${ethereum.providers.length} providers. Selected: ${selectedProvider.isMetaMask ? "MetaMask" : "Default"}`);
    }

    try {
      if (!isAuto) addLog("Requesting account access...");

      const accounts = await selectedProvider.request({
        method: isAuto ? 'eth_accounts' : 'eth_requestAccounts'
      });

      if (Array.isArray(accounts) && accounts.length > 0) {
        if (!isAuto) addLog(`Success: Linked to ${accounts[0].slice(0, 6)}...`);
        const newProvider = new ethers.BrowserProvider(selectedProvider);
        setProvider(newProvider);
        setAccount(accounts[0]);
      } else {
        if (!isAuto) addLog("⚠️ Error: No accounts returned.");
      }
    } catch (err: any) {
      console.error(err);
      if (!isAuto) {
        const errorMsg = err.message || "Unknown Error";
        addLog(`❌ Connection Failed: ${errorMsg}`);
        alert(`Wallet connection failed: ${errorMsg}`);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [addLog, isConnecting]);

  // Phase 10: Auto-Link & Event Listeners
  useEffect(() => {
    // Attempt auto-connection on mount
    connectWallet(true);

    const ethereum = (window as any).ethereum;
    if (ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          addLog(`Neural sync: Switched account to ${accounts[0].slice(0, 6)}...`);
        } else {
          setAccount('');
          setProvider(null);
          addLog("Neural link severed by user.");
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [connectWallet, addLog]);

  // Routing Logic
  if (provider && account) {
    if (showExperiment) {
      return (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowExperiment(false)}
            style={{
              position: 'fixed',
              top: '1rem',
              right: '1rem',
              padding: '0.5rem 1rem',
              background: 'rgba(0,0,0,0.5)',
              color: '#06b6d4',
              border: '1px solid #06b6d4',
              borderRadius: '8px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              zIndex: 100
            }}
          >
            ← BACK
          </button>
          <LifterExperiment
            provider={provider}
            onMintSuccess={handleMintSuccess}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'monospace' }}>
        <h1 style={{ color: '#ec4899', fontSize: '3.5rem', textShadow: '0 0 15px #ec4899', marginBottom: '0.5rem' }}>
          RESONANT REALMS
        </h1>
        <p style={{ color: '#06b6d4', letterSpacing: '0.3em', marginBottom: '2rem' }}>JUPITER PATH: GENESIS EXPERIMENT</p>

        <div style={{
          padding: '2rem',
          border: '1px solid #10b981',
          borderRadius: '12px',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          width: '100%',
          maxWidth: '500px'
        }}>
          <p style={{ color: '#10b981', marginBottom: '1rem' }}>{">"} STATUS: Neural Link Established</p>
          <p style={{ color: '#FFD700', fontSize: '0.8rem', overflowWrap: 'anywhere' }}>
            {">"} GUARDIAN: {account.slice(0, 6)}...{account.slice(-4)}
          </p>

          <button
            onClick={() => setShowExperiment(true)}
            style={{
              marginTop: '1.5rem',
              width: '100%',
              padding: '15px 20px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 0 15px #06b6d4'
            }}
          >
            ⚡ ENTER GENESIS EXPERIMENT
          </button>

          <p style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.75rem', textAlign: 'center' }}>
            Achieve ≥30% mass reduction to unlock ǃKaggen (Tribe 0)
          </p>
        </div>

        {debugLog.length > 0 && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '4px',
            fontSize: '0.65rem',
            color: '#6ee7b7',
            borderLeft: '2px solid #10b981',
            maxWidth: '500px',
            width: '100%'
          }}>
            {debugLog.map((log, i) => (
              <div key={i}>{">"} {log}</div>
            ))}
          </div>
        )}

        <p style={{ color: '#4b5563', marginTop: '2rem', fontSize: '0.7rem' }}>
          Integration Layer • Foundation Protocol • Diamond Standard
        </p>
      </div>
    );
  }

  // Connection Screen
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4" style={{ fontFamily: 'monospace' }}>
      <h1 style={{ color: '#ec4899', fontSize: '3.5rem', textShadow: '0 0 15px #ec4899', marginBottom: '0.5rem' }}>
        RESONANT REALMS
      </h1>
      <p style={{ color: '#06b6d4', letterSpacing: '0.3em', marginBottom: '2rem' }}>PHASE 3: INTEGRATION LAYER</p>

      <div style={{
        padding: '2rem',
        border: '1px solid #10b981',
        borderRadius: '12px',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        width: '100%',
        maxWidth: '500px'
      }}>
        <p style={{ color: '#10b981', marginBottom: '1rem' }}>{">"} STATUS: Awaiting Neural Link...</p>

        <button
          onClick={() => connectWallet(false)}
          disabled={isConnecting}
          style={{
            marginTop: '1.5rem',
            width: '100%',
            padding: '15px 20px',
            backgroundColor: isConnecting ? '#4b5563' : '#ec4899',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isConnecting ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isConnecting ? "SYNCHRONIZING..." : "CONNECT ANCESTRAL LINK"}
        </button>

        {debugLog.length > 0 && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '4px',
            fontSize: '0.7rem',
            color: '#6ee7b7',
            borderLeft: '2px solid #10b981'
          }}>
            {debugLog.map((log, i) => (
              <div key={i}>{">"} {log}</div>
            ))}
          </div>
        )}
      </div>

      <p style={{ color: '#4b5563', marginTop: '2rem', fontSize: '0.7rem' }}>
        Tribe Index 0 (Khoe-San) Foundation Verified
      </p>
    </div>
  );
}

export default App;
