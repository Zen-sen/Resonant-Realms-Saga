import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';

// ═══════════════════════════════════════════════════════════════════════════════
// DIAMOND CONTRACT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const DIAMOND_ADDRESS = '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e';

// FORGE BYPASS: Hardcoded fallback for testing without wallet
const FORGE_BYPASS = true; // Set to true to bypass connection and use mock data



// ABI fragments for all facets needed by the UI
const DIAMOND_ABI = [
  // AncestralHeritageFacet
  'function getPlayerStats(address _player) external view returns (uint256 tribeId, uint256 resonance, uint256 buffMask)',
  'function getTribe(uint256 _tribeId) external view returns (string memory name, bool isActive)',
  'function getTribeCount() external pure returns (uint256)',
  
  // KycVerificationFacet
  'function getKycStatus(address _user) external view returns (uint8 level, bool verified, uint256 verifiedAt, bytes32 piUsernameHash, string memory documentURI)',
  'function getKycLevel(address _user) external view returns (uint8)',
  'function isKycVerified(address _user, uint8 _minLevel) external view returns (bool)',
  
  // UbuntuPointsFacet - indirect via storage reads
  // We read totalUbuntuPoints from AppStorage via getter
  
  // ResonanceFacet
  'function getEntityPhysics(uint256 _bunnyId) external view returns (int256 x, int256 y, int256 velocityY, bool isFloating)',
  
  // Events to listen for
  'event ResonanceAscended(address indexed player, uint256 bunnyId, uint256 newResonance)',
  'event KycVerified(address indexed user, uint8 level, uint256 verifiedAt)',
  'event AscensionRitualComplete(address indexed player, uint256 tribeId, uint256 timestamp)',
  'event UbuntuGifted(address indexed from, address indexed to, uint256 amount)',
];

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface KycStatus {
  level: number;        // 0-3: None, Basic, Advanced, Enterprise
  verified: boolean;
  verifiedAt: number;   // timestamp
  piUsernameHash: string;
  documentURI: string;
}

export interface PlayerStats {
  tribeId: number;      // 0-12
  resonance: number;
  buffMask: number;      // Bitmask of active tribal buffs
}

export interface TribeInfo {
  name: string;
  isActive: boolean;
  mass: number;          // Physics: gravity influence
  buoyancy: number;      // Physics: lift influence
}

export interface UIState {
  // Identity & Verification
  playerStats: PlayerStats | null;
  kycStatus: KycStatus | null;
  
  // Economy
  ubuntuPoints: number;
  ubuntuReservoirLevel: number; // 0-100 percentage for visual
  
  // Resonance & Game State
  currentResonance: number;
  resonanceFrequency: number;     // 44Hz default, 88Hz during combos
  comboChain: number;             // Current combo count
  
  // Visual Theme State
  activeTheme: 'foundation' | 'branch' | 'synthesis';
  tribeColors: string[];
  
  // Loading & Error States
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;            // timestamp
}

export interface UIActions {
  refresh: () => Promise<void>;
  setComboChain: (combo: number) => void;
  triggerMercyPulse: () => void;
  clearError: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRIBE PHYSICS CONSTANTS (from AncestralUtils.sol)
// ═══════════════════════════════════════════════════════════════════════════════

export const TRIBE_PHYSICS: Record<number, { mass: number; buoyancy: number; name: string }> = {
  0:  { mass: 150, buoyancy: 0,   name: 'Khoe-San' },    // Foundation
  1:  { mass: 180, buoyancy: 20,  name: 'Zulu' },        // Lightning Mass
  2:  { mass: 80,  buoyancy: 60,  name: 'Xhosa' },       // Resonance Buoyancy
  3:  { mass: 100, buoyancy: 30,  name: 'Sotho' },       // Steadfast Bridge
  4:  { mass: 100, buoyancy: 30,  name: 'Setswana' },    // Diplomatic Balance
  5:  { mass: 50,  buoyancy: 90,  name: 'Sepedi' },      // Regenerative Healer
  6:  { mass: 100, buoyancy: 50,  name: 'Xitsonga' },    // Xibelani Spin
  7:  { mass: 90,  buoyancy: 40,  name: 'Swati' },       // Ceremonial Dancer
  8:  { mass: 120, buoyancy: 35,  name: 'Venda' },       // Mystic Anchor
  9:  { mass: 90,  buoyancy: 50,  name: 'isiNdebele' },  // Symmetric Harmony
  10: { mass: 85,  buoyancy: 55,  name: 'Tsonga' },      // Coastal Drift
  11: { mass: 130, buoyancy: 25,  name: 'Afrikaans' },   // Frontier Forge
  12: { mass: 70,  buoyancy: 80,  name: 'Synthesis' },    // The Bridge
};

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS (Color Palette)
// ═══════════════════════════════════════════════════════════════════════════════

export const DESIGN_TOKENS = {
  colors: {
    foundationOchre: '#CC7722',
    resonanceGold: '#FFBF00',
    shadowCharcoal: '#36454F',
    digitalCyan: '#06b6d4',
    magentaGlow: '#ec4899',
    emeraldPulse: '#10b981',
    synthesisPrism: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
  },
  typography: {
    title: "'Cinzel', 'Trajan Pro', serif",           // Chiseled stone
    data: "'JetBrains Mono', 'Fira Code', monospace", // Pi Network logic
    dialogue: "'Source Sans Pro', sans-serif",        // Player voice
  },
  frequencies: {
    default: 44,    // Hz - resting resonance
    combo: 88,      // Hz - high combo chains
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Determines the active theme based on tribe ID
 */
function getThemeForTribe(tribeId: number): 'foundation' | 'branch' | 'synthesis' {
  if (tribeId === 0) return 'foundation';
  if (tribeId === 12) return 'synthesis';
  return 'branch';
}

/**
 * Gets tribe-specific color palette
 */
function getTribeColors(tribeId: number): string[] {
  switch (tribeId) {
    case 0: // Khoe-San - Ochre & Amber
      return ['#CC7722', '#FFBF00', '#8B4513', '#D2691E'];
    case 1: // Zulu - Royal colors
      return ['#4B0082', '#FFD700', '#FF0000', '#000000'];
    case 2: // Xhosa - Earth & Sky
      return ['#2F4F4F', '#87CEEB', '#8B4513', '#F5DEB3'];
    case 3: // Sotho - Mountain colors
      return ['#708090', '#4682B4', '#2F4F4F', '#B0C4DE'];
    case 4: // Setswana - Rain & Earth
      return ['#4682B4', '#8B7355', '#87CEEB', '#D2B48C'];
    case 5: // Sepedi - Healing greens
      return ['#228B22', '#90EE90', '#98FB98', '#006400'];
    case 6: // Xitsonga - Vibrant dance
      return ['#FF1493', '#FFD700', '#FF4500', '#9400D3'];
    case 7: // Swati - Reed & Royal
      return ['#9ACD32', '#FFD700', '#8B4513', '#DC143C'];
    case 8: // Venda - Mystic purples
      return ['#4B0082', '#8A2BE2', '#9932CC', '#BA55D3'];
    case 9: // isiNdebele - Geometric primaries
      return ['#FF0000', '#FFFF00', '#0000FF', '#FFFFFF', '#000000'];
    case 10: // Tsonga - Coastal blues
      return ['#1E90FF', '#00CED1', '#20B2AA', '#87CEFA'];
    case 11: // Afrikaans - Frontier earth
      return ['#8B4513', '#A0522D', '#CD853F', '#D2691E'];
    case 12: // Synthesis - All colors (prismatic)
      return DESIGN_TOKENS.colors.synthesisPrism;
    default:
      return [DESIGN_TOKENS.colors.foundationOchre];
  }
}

/**
 * Calculates reservoir level percentage from Ubuntu Points
 */
function calculateReservoirLevel(ubuntuPoints: number): number {
  // Scale: 0-10000 UP = 0-100% reservoir
  // Cap at 100% for visual purposes
  const maxUP = 10000;
  return Math.min(100, (ubuntuPoints / maxUP) * 100);
}

/**
 * Calculates resonance frequency based on combo chain
 */
function calculateResonanceFrequency(comboChain: number): number {
  if (comboChain >= 5) return DESIGN_TOKENS.frequencies.combo;
  // Interpolate between 44 and 88 based on combo
  const ratio = Math.min(comboChain / 5, 1);
  return DESIGN_TOKENS.frequencies.default + 
    (ratio * (DESIGN_TOKENS.frequencies.combo - DESIGN_TOKENS.frequencies.default));
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HOOK: useUIState
// ═══════════════════════════════════════════════════════════════════════════════

export function useUIState(
  provider: ethers.BrowserProvider | null,
  account: string | null,
  pollInterval: number = 5000 // Poll every 5 seconds
): [UIState, UIActions] {
  
  // Contract reference
  const contractRef = useRef<ethers.Contract | null>(null);
  
  // Main state
  const [state, setState] = useState<UIState>(FORGE_BYPASS ? {
    // FORGE BYPASS: Mock data for testing
    playerStats: {
      tribeId: 0, // Khoe-San
      resonance: 440,
      buffMask: 0,
    },
    kycStatus: {
      level: 1,
      verified: true,
      verifiedAt: Date.now(),
      piUsernameHash: '0x1234',
      documentURI: '',
    },
    ubuntuPoints: 2500,
    ubuntuReservoirLevel: 25,
    currentResonance: 440,
    resonanceFrequency: DESIGN_TOKENS.frequencies.default,
    comboChain: 0,
    activeTheme: 'foundation',
    tribeColors: getTribeColors(0),
    isLoading: false,
    error: null,
    lastUpdated: Date.now(),
  } : {
    playerStats: null,
    kycStatus: null,
    ubuntuPoints: 0,
    ubuntuReservoirLevel: 0,
    currentResonance: 0,
    resonanceFrequency: DESIGN_TOKENS.frequencies.default,
    comboChain: 0,
    activeTheme: 'foundation',
    tribeColors: [DESIGN_TOKENS.colors.foundationOchre],
    isLoading: false,
    error: null,
    lastUpdated: 0,
  });


  // Initialize contract when provider changes
  useEffect(() => {
    if (provider) {
      contractRef.current = new ethers.Contract(DIAMOND_ADDRESS, DIAMOND_ABI, provider);
    } else {
      contractRef.current = null;
    }
  }, [provider]);

  // ═════════════════════════════════════════════════════════════════════════════
  // DATA FETCHING
  // ═════════════════════════════════════════════════════════════════════════════

  const fetchPlayerData = useCallback(async () => {
    if (!contractRef.current || !account) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const contract = contractRef.current;

      // Fetch all data in parallel
      const [playerStats, kycStatus, kycLevel] = await Promise.all([
        contract.getPlayerStats(account) as Promise<[bigint, bigint, bigint]>,
        contract.getKycStatus(account) as Promise<[number, boolean, bigint, string, string]>,
        contract.getKycLevel(account) as Promise<number>,
      ]);

      // Parse player stats
      const tribeId = Number(playerStats[0]);
      const resonance = Number(playerStats[1]);
      const buffMask = Number(playerStats[2]);

      // Parse KYC status
      const kycData: KycStatus = {
        level: Number(kycStatus[0]),
        verified: kycStatus[1],
        verifiedAt: Number(kycStatus[2]),
        piUsernameHash: kycStatus[3],
        documentURI: kycStatus[4],
      };

      // Calculate derived values
      const activeTheme = getThemeForTribe(tribeId);
      const tribeColors = getTribeColors(tribeId);
      
      // Ubuntu Points - read from public mapping via a view function
      // Note: In production, this would be a dedicated getter
      let ubuntuPoints = 0;
      try {
        // Attempt to read from a getter if available
        const upData = await contract.totalUbuntuPoints?.(account);
        if (upData) ubuntuPoints = Number(upData);
      } catch {
        // Fallback: estimate from resonance and other factors
        ubuntuPoints = resonance * 10;
      }

      const ubuntuReservoirLevel = calculateReservoirLevel(ubuntuPoints);
      const resonanceFrequency = calculateResonanceFrequency(state.comboChain);

      setState(prev => ({
        ...prev,
        playerStats: {
          tribeId,
          resonance,
          buffMask,
        },
        kycStatus: kycData,
        ubuntuPoints,
        ubuntuReservoirLevel,
        currentResonance: resonance,
        resonanceFrequency,
        activeTheme,
        tribeColors,
        isLoading: false,
        lastUpdated: Date.now(),
      }));

    } catch (err: any) {
      console.error('[useUIState] Error fetching player data:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || 'Failed to fetch player data',
      }));
    }
  }, [account, state.comboChain]);

  // ═════════════════════════════════════════════════════════════════════════════
  // EVENT LISTENERS
  // ═════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!contractRef.current || !account) return;

    const contract = contractRef.current;

    // Set up event listeners for real-time updates
    const filters = [
      contract.filters.ResonanceAscended(account),
      contract.filters.KycVerified(account),
      contract.filters.AscensionRitualComplete(account),
    ];

    const handleResonanceAscended = (
      player: string,
      bunnyId: bigint,
      newResonance: bigint
    ) => {
      if (player.toLowerCase() !== account.toLowerCase()) return;
      
      setState(prev => ({
        ...prev,
        currentResonance: Number(newResonance),
        // Boost frequency temporarily on ascension
        resonanceFrequency: DESIGN_TOKENS.frequencies.combo,
      }));

      // Reset frequency after animation
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          resonanceFrequency: calculateResonanceFrequency(prev.comboChain),
        }));
      }, 2000);
    };

    const handleKycVerified = (
      user: string,
      level: number,
      verifiedAt: bigint
    ) => {
      if (user.toLowerCase() !== account.toLowerCase()) return;
      
      setState(prev => ({
        ...prev,
        kycStatus: prev.kycStatus ? {
          ...prev.kycStatus,
          level,
          verified: true,
          verifiedAt: Number(verifiedAt),
        } : null,
      }));
    };

    const handleAscensionRitual = (
      player: string,
      tribeId: bigint,
      timestamp: bigint
    ) => {
      if (player.toLowerCase() !== account.toLowerCase()) return;
      
      const newTribeId = Number(tribeId);
      setState(prev => ({
        ...prev,
        playerStats: prev.playerStats ? {
          ...prev.playerStats,
          tribeId: newTribeId,
        } : null,
        activeTheme: getThemeForTribe(newTribeId),
        tribeColors: getTribeColors(newTribeId),
      }));
    };

    // Subscribe to events
    contract.on('ResonanceAscended', handleResonanceAscended);
    contract.on('KycVerified', handleKycVerified);
    contract.on('AscensionRitualComplete', handleAscensionRitual);

    // Cleanup
    return () => {
      contract.off('ResonanceAscended', handleResonanceAscended);
      contract.off('KycVerified', handleKycVerified);
      contract.off('AscensionRitualComplete', handleAscensionRitual);
    };
  }, [account]);

  // ═════════════════════════════════════════════════════════════════════════════
  // POLLING
  // ═════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!account) return;

    // Initial fetch
    fetchPlayerData();

    // Set up polling interval
    const interval = setInterval(fetchPlayerData, pollInterval);

    return () => clearInterval(interval);
  }, [account, fetchPlayerData, pollInterval]);

  // ═════════════════════════════════════════════════════════════════════════════
  // ACTIONS
  // ═════════════════════════════════════════════════════════════════════════════

  const refresh = useCallback(async () => {
    await fetchPlayerData();
  }, [fetchPlayerData]);

  const setComboChain = useCallback((combo: number) => {
    setState(prev => ({
      ...prev,
      comboChain: combo,
      resonanceFrequency: calculateResonanceFrequency(combo),
    }));
  }, []);

  const triggerMercyPulse = useCallback(() => {
    // Visual pulse effect for Ubuntu Reservoir
    // This would trigger a CSS animation in the component
    setState(prev => ({
      ...prev,
      ubuntuReservoirLevel: Math.min(100, prev.ubuntuReservoirLevel + 10),
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const actions: UIActions = {
    refresh,
    setComboChain,
    triggerMercyPulse,
    clearError,
  };

  return [state, actions];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADDITIONAL UTILITY HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook for accessing tribe physics properties
 */
export function useTribePhysics(tribeId: number | null) {
  return tribeId !== null ? TRIBE_PHYSICS[tribeId] : null;
}

/**
 * Hook for checking KYC gate requirements
 */
export function useKycGate(
  provider: ethers.BrowserProvider | null,
  account: string | null,
  requiredLevel: number
): { canAccess: boolean; isLoading: boolean } {
  const [canAccess, setCanAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!provider || !account) {
      setCanAccess(false);
      setIsLoading(false);
      return;
    }

    const checkAccess = async () => {
      try {
        const contract = new ethers.Contract(DIAMOND_ADDRESS, DIAMOND_ABI, provider);
        const hasAccess = await contract.isKycVerified(account, requiredLevel);
        setCanAccess(hasAccess);
      } catch (err) {
        console.error('[useKycGate] Error checking KYC:', err);
        setCanAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [provider, account, requiredLevel]);

  return { canAccess, isLoading };
}

/**
 * Hook for real-time resonance tracking
 */
export function useResonanceTracker(
  provider: ethers.BrowserProvider | null,
  account: string | null,
  bunnyId: number | null
): { physics: { x: number; y: number; velocityY: number; isFloating: boolean } | null; isLoading: boolean } {
  const [physics, setPhysics] = useState<{ x: number; y: number; velocityY: number; isFloating: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!provider || !account || bunnyId === null) {
      setPhysics(null);
      setIsLoading(false);
      return;
    }

    const fetchPhysics = async () => {
      try {
        const contract = new ethers.Contract(DIAMOND_ADDRESS, DIAMOND_ABI, provider);
        const data = await contract.getEntityPhysics(bunnyId);
        
        setPhysics({
          x: Number(data[0]),
          y: Number(data[1]),
          velocityY: Number(data[2]),
          isFloating: data[3],
        });
      } catch (err) {
        console.error('[useResonanceTracker] Error fetching physics:', err);
        setPhysics(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhysics();
    
    // Poll physics at 60fps equivalent for smooth animations
    const interval = setInterval(fetchPhysics, 16);
    return () => clearInterval(interval);
  }, [provider, account, bunnyId]);

  return { physics, isLoading };
}

export default useUIState;
