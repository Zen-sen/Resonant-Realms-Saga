import React, { useState } from 'react';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('Awaiting Neural Link...');
  const diamondAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setStatus('Initiating Handshake...');
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setStatus('Neural Link Established');
      } catch (err) {
        setStatus('Link Refused');
      }
    } else {
      setStatus('No Wallet Detected');
    }
  };

  return (
    <div style={{ backgroundColor: '#050505', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#ec4899', fontSize: '3rem' }}>RESONANT REALMS</h1>
      <div style={{ border: '1px solid #10b981', padding: '20px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)' }}>
        <p style={{ color: '#10b981' }}>{">"} STATUS: {status}</p>
        <p style={{ fontSize: '0.8rem', color: '#666' }}>DIAMOND: {diamondAddress}</p>
        {account ? (
          <p style={{ color: '#FFD700' }}>{">"} GUARDIAN: {account}</p>
        ) : (
          <button onClick={connectWallet} style={{ background: '#ec4899', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', marginTop: '10px' }}>
            CONNECT ANCESTRAL LINK
          </button>
        )}
      </div>
    </div>
  );
}

export default App;