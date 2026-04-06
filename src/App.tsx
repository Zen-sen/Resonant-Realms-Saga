import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { LifterExperiment } from './components/LifterExperiment';
import { useUIState } from './hooks/useUIState';
import { UbuntuReservoir } from './components/hud/UbuntuReservoir';
import { ResonanceFrequency } from './components/hud/ResonanceFrequency';
import { ArchitectSeal } from './components/hud/ArchitectSeal';
import { Match3Grid } from './components/game/Match3Grid';
import { DeployPanel } from './components/DeployPanel';

/**
 * @component App
 * The high-level neural interface for Resonant Realms.
 * Handles Diamond Stone connection and Genesis Experiment routing.
 * Phase 3: Integrated with Balanced Bridge UI System
 */
function App() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string>('');
  const [showExperiment, setShowExperiment] = useState(false);
  const [showMatch3, setShowMatch3] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize UI State Hook (Single Source of Truth)
  const [uiState, uiActions] = useUIState(provider, account);

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
    console.log('[FORGE DEBUG] connectWallet triggered', { isAuto, isConnecting });
    
    if (isConnecting) {
      console.log('[FORGE DEBUG] Already connecting, skipping');
      return;
    }
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

  // FORGE BYPASS: Hardcoded fallback for testing
  const FORGE_BYPASS = true; // Set to true to bypass connection
  
  // Routing Logic
  if ((provider && account) || FORGE_BYPASS) {
    // Match-3 Game Mode
    if (showMatch3) {
      return (
        <div style={{ 
          position: 'relative',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #050505 0%, #0f0f1e 100%)',
          padding: '1rem',
        }}>
          {/* Back Button */}
          <button
            onClick={() => setShowMatch3(false)}
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

          {/* HUD Layer */}
          <div style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 50,
          }}>
            <UbuntuReservoir
              ubuntuPoints={uiState.ubuntuPoints}
              reservoirLevel={uiState.ubuntuReservoirLevel}
              isPulsing={uiState.ubuntuReservoirLevel > 80}
              tribeId={uiState.playerStats?.tribeId || 0}
            />
          </div>

          <div style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
          }}>
            <ResonanceFrequency
              frequency={uiState.resonanceFrequency}
              resonance={uiState.currentResonance}
              comboChain={uiState.comboChain}
              isActive={true}
              tribeId={uiState.playerStats?.tribeId || 0}
            />
          </div>

          <div style={{
            position: 'fixed',
            top: '1rem',
            right: '5rem',
            zIndex: 50,
          }}>
            <ArchitectSeal
              kycLevel={uiState.kycStatus?.level || 0}
              isVerified={uiState.kycStatus?.verified || false}
              verifiedAt={uiState.kycStatus?.verifiedAt}
              tribeId={uiState.playerStats?.tribeId || 0}
              showDetails={false}
            />
          </div>

          {/* Game Grid */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            paddingTop: '120px',
          }}>
            <Match3Grid
              provider={provider}
              account={account}
              onCombo={(combo) => uiActions.setComboChain(combo)}
              onResonanceGain={(amount) => {
                addLog(`Resonance +${amount}`);
              }}
              onAnxietySpike={(level) => {
                addLog(`Anxiety Level ${level} detected`);
              }}
            />
          </div>
        </div>
      );
    }

    // Genesis Experiment Mode
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
            provider={provider || undefined}
            onMintSuccess={handleMintSuccess}
          />
        </div>
      );
    }

    // Main Dashboard
    return (
      <div 
        className={`min-h-screen flex flex-col items-center justify-center p-4 tribe-theme-${uiState.activeTheme}`}
        style={{ 
          fontFamily: 'monospace',
          background: uiState.activeTheme === 'foundation' 
            ? 'linear-gradient(135deg, #1a0f0a 0%, #2d1f16 100%)'
            : uiState.activeTheme === 'synthesis'
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d1b4e 50%, #1a1a1a 100%)'
            : 'linear-gradient(135deg, #050505 0%, #0f0f1e 100%)'
        }}
      >
        <h1 style={{ 
          color: uiState.activeTheme === 'foundation' ? '#CC7722' : uiState.activeTheme === 'synthesis' ? '#fff' : '#ec4899', 
          fontSize: '3.5rem', 
          textShadow: `0 0 15px ${uiState.activeTheme === 'foundation' ? '#CC7722' : uiState.activeTheme === 'synthesis' ? '#fff' : '#ec4899'}`, 
          marginBottom: '0.5rem' 
        }}>
          RESONANT REALMS
        </h1>
        <p style={{ 
          color: '#06b6d4', 
          letterSpacing: '0.3em', 
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}>
          {uiState.activeTheme === 'foundation' ? 'THE FIRST DREAM' : 
           uiState.activeTheme === 'synthesis' ? 'THE BALANCED BRIDGE' : 
           'JUPITER PATH: GENESIS EXPERIMENT'}
        </p>

        {/* HUD Preview */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <UbuntuReservoir
            ubuntuPoints={uiState.ubuntuPoints}
            reservoirLevel={uiState.ubuntuReservoirLevel}
            tribeId={uiState.playerStats?.tribeId || 0}
          />
          <ResonanceFrequency
            frequency={uiState.resonanceFrequency}
            resonance={uiState.currentResonance}
            comboChain={uiState.comboChain}
            tribeId={uiState.playerStats?.tribeId || 0}
          />
          <ArchitectSeal
            kycLevel={uiState.kycStatus?.level || 0}
            isVerified={uiState.kycStatus?.verified || false}
            tribeId={uiState.playerStats?.tribeId || 0}
          />
        </div>

        <div style={{
          padding: '2rem',
          border: `1px solid ${uiState.activeTheme === 'foundation' ? '#CC7722' : uiState.activeTheme === 'synthesis' ? '#fff' : '#10b981'}40`,
          borderRadius: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          maxWidth: '500px'
        }}>
          <p style={{ 
            color: uiState.activeTheme === 'foundation' ? '#CC7722' : uiState.activeTheme === 'synthesis' ? '#fff' : '#10b981', 
            marginBottom: '1rem',
            fontFamily: 'monospace'
          }}>
            {">"} STATUS: Neural Link Established
          </p>
          <p style={{ color: '#FFD700', fontSize: '0.8rem', overflowWrap: 'anywhere', marginBottom: '0.5rem' }}>
            {">"} GUARDIAN: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
          {uiState.playerStats?.tribeId !== undefined && (
            <p style={{ color: '#9ca3af', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
              {">"} TRIBE: {['Khoe-San', 'Zulu', 'Xhosa', 'Sotho', 'Setswana', 'Sepedi', 'Xitsonga', 'Swati', 'Venda', 'isiNdebele', 'Tsonga', 'Afrikaans', 'Synthesis'][uiState.playerStats.tribeId] || 'Unknown'}
            </p>
          )}
          {uiState.kycStatus && (
            <p style={{ color: '#9ca3af', fontSize: '0.7rem', marginBottom: '1rem' }}>
              {">"} KYC: Level {uiState.kycStatus.level} {uiState.kycStatus.verified ? '✓' : '○'}
            </p>
          )}

          <button
            onClick={() => setShowExperiment(true)}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '15px 20px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: '0 0 15px #06b6d4',
              marginBottom: '0.75rem'
            }}
          >
            ⚡ ENTER GENESIS EXPERIMENT
          </button>

          <button
            onClick={() => setShowMatch3(true)}
            style={{
              width: '100%',
              padding: '15px 20px',
              background: uiState.activeTheme === 'foundation' 
                ? 'linear-gradient(135deg, #CC7722 0%, #FFBF00 100%)'
                : uiState.activeTheme === 'synthesis'
                ? 'linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)'
                : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              boxShadow: uiState.activeTheme === 'foundation' 
                ? '0 0 15px #CC7722'
                : '0 0 15px #ec4899'
            }}
          >
            🎮 ENTER RESONANCE REALM
          </button>

          <p style={{ color: '#9ca3af', marginTop: '1rem', fontSize: '0.75rem', textAlign: 'center' }}>
            {uiState.activeTheme === 'foundation' 
              ? 'The First Dream awaits. Ancient wisdom guides your path.'
              : uiState.activeTheme === 'synthesis'
              ? 'Expert Mode: All colors converge. The Bridge awaits.'
              : 'Achieve ≥30% mass reduction to unlock ǃKaggen (Tribe 0)'}
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
            borderLeft: `2px solid ${uiState.activeTheme === 'foundation' ? '#CC7722' : '#10b981'}`,
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

        <DeployPanel />

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
