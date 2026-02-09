import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState<string>('');
  const [status, setStatus] = useState<string>('Awaiting Neural Link...');
  const diamondAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setStatus('Initiating Handshake...');
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setStatus('Neural Link Established');
      } catch (err) {
        console.error(err);
        setStatus('Link Refused');
      }
    } else {
      setStatus('No Wallet Detected');
    }
  };

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
        <p style={{ color: '#10b981', marginBottom: '1rem' }}>{">"} STATUS: {status}</p>
        <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{">"} DIAMOND: {diamondAddress}</p>
        
        {account ? (
          <p style={{ color: '#FFD700', marginTop: '1rem', overflowWrap: 'anywhere' }}>
            {">"} GUARDIAN: {account}
          </p>
        ) : (
          <button 
            onClick={connectWallet}
            style={{
              marginTop: '1.5rem',
              padding: '10px 20px',
              backgroundColor: '#ec4899',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            CONNECT ANCESTRAL LINK
          </button>
        )}
      </div>
      
      <p style={{ color: '#4b5563', marginTop: '2rem', fontSize: '0.7rem' }}>
        Tribe Index 0 (Khoe-San) Foundation Verified
      </p>
    </div>
  );
}

export default App;
EOFcat <<EOF > src/App.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState<string>('');
  const [status, setStatus] = useState<string>('Awaiting Neural Link...');
  const diamondAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setStatus('Initiating Handshake...');
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setStatus('Neural Link Established');
      } catch (err) {
        console.error(err);
        setStatus('Link Refused');
      }
    } else {
      setStatus('No Wallet Detected');
    }
  };

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
        <p style={{ color: '#10b981', marginBottom: '1rem' }}>{">"} STATUS: {status}</p>
        <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{">"} DIAMOND: {diamondAddress}</p>
        
        {account ? (
          <p style={{ color: '#FFD700', marginTop: '1rem', overflowWrap: 'anywhere' }}>
            {">"} GUARDIAN: {account}
          </p>
        ) : (
          <button 
            onClick={connectWallet}
            style={{
              marginTop: '1.5rem',
              padding: '10px 20px',
              backgroundColor: '#ec4899',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            CONNECT ANCESTRAL LINK
          </button>
        )}
      </div>
      
      <p style={{ color: '#4b5563', marginTop: '2rem', fontSize: '0.7rem' }}>
        Tribe Index 0 (Khoe-San) Foundation Verified
      </p>
    </div>
  );
}

export default App;
