import React, { useState } from 'react';
import { ethers } from 'ethers';
import { LifterExperiment } from './components/LifterExperiment';

function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>('');
  const [showExperiment, setShowExperiment] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await newProvider.send("eth_requestAccounts", []);
        setProvider(newProvider);
        setAccount(accounts[0]);
      } catch (err) {
        console.error(err);
        alert('Wallet connection failed');
      }
    } else {
      alert('Please install MetaMask');
    }
  };

  const handleMintSuccess = () => {
    alert('🎉 ASCENSION COMPLETE! ǃKaggen (Tribe 0) eligibility minted.');
  };

  // Show experiment if wallet connected
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

        <p style={{ color: '#4b5563', marginTop: '2rem', fontSize: '0.7rem' }}>
          Integration Layer • Foundation Protocol • Diamond Standard
        </p>
      </div>
    );
  }

  // Initial wallet connection screen
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
          onClick={connectWallet}
          style={{
            marginTop: '1.5rem',
            width: '100%',
            padding: '10px 20px',
            backgroundColor: '#ec4899',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          CONNECT ANCESTRAL LINK
        </button>
      </div>

      <p style={{ color: '#4b5563', marginTop: '2rem', fontSize: '0.7rem' }}>
        Tribe Index 0 (Khoe-San) Foundation Verified
      </p>
    </div>
  );
}

export default App;
