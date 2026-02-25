import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tile, TileProps } from './Tile';
import { useUIState, useTribePhysics, TRIBE_PHYSICS, DESIGN_TOKENS } from '../../hooks/useUIState';
import { usePhysicsEngine, getPhysicsConfig } from '../../hooks/usePhysicsEngine';
import { ethers } from 'ethers';

interface Match3GridProps {
  provider: ethers.BrowserProvider | null;
  account: string | null;
  bunnyId?: number;       // Entity ID for physics tracking
  kycLevel?: number;      // KYC level for visual modes (0-3)
  onCombo?: (combo: number) => void;
  onResonanceGain?: (amount: number) => void;
  onAnxietySpike?: (level: number) => void;
}

interface GridTile extends Omit<TileProps, 'onClick' | 'onAnimationComplete'> {
  isMatched: boolean;
  isSelected: boolean;
}

/**
 * @component Match3Grid
 * The Match-3 Grid with Ancestral Physics integration.
 * 
 * Visual Logic:
 * - Grid reflects the Ancestral Physics from AncestralUtils.sol
 * - Mass & Buoyancy FX per tribe:
 *   - Tribe 11 (Afrikaans): Heavy metallic "clank" (Mass 130)
 *   - Tribe 5 (Sepedi): Floats like feathers (Buoyancy 90)
 * - Mirror-Adversary Overlay: Grid edges blur during "Anxiety Spike"
 * - KYC Level 3: Transparent grid, tiles float in starlight void
 * - Match-4: Buoyancy wave negates mass temporarily
 * 
 * Contract Mapping:
 * - Physics: ResonanceFacet.getEntityPhysics(bunnyId)
 * - Resonance: ResonanceFacet.recordResonance()
 * - Cascade: AncestralHeritageFacet.recordResonanceCascade()
 */
export function Match3Grid({
  provider,
  account,
  bunnyId = 0,
  kycLevel = 0,
  onCombo,
  onResonanceGain,
  onAnxietySpike,
}: Match3GridProps) {
  // Grid configuration
  const GRID_WIDTH = 8;
  const GRID_HEIGHT = 8;
  const TILE_TYPES = ['gem', 'relic', 'ancestral'] as const;
  const TILE_COLORS = [
    '#ef4444', // Red
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#8b5cf6', // Purple
    '#ec4899', // Pink
  ];

  // State
  const [grid, setGrid] = useState<GridTile[]>([]);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [comboChain, setComboChain] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [anxietyLevel, setAnxietyLevel] = useState(0);
  const [showCorruption, setShowCorruption] = useState(false);
  const [tribeId, setTribeId] = useState(0);
  const [buoyancyWaveActive, setBuoyancyWaveActive] = useState(false);
  const [cameraShake, setCameraShake] = useState({ x: 0, y: 0 });
  
  // Refs
  const gridRef = useRef<HTMLDivElement>(null);
  const comboTimeoutRef = useRef<NodeJS.Timeout>();
  const shakeRef = useRef<HTMLDivElement>(null);
  
  // Get UI state for theming
  const [uiState] = useUIState(provider, account);
  const tribePhysics = useTribePhysics(tribeId);
  const { triggerCameraShake } = usePhysicsEngine();

  // Initialize grid
  useEffect(() => {
    initializeGrid();
  }, []);

  // Update tribe from UI state
  useEffect(() => {
    if (uiState.playerStats?.tribeId !== undefined) {
      setTribeId(uiState.playerStats.tribeId);
    }
  }, [uiState.playerStats]);

  // Camera shake effect for heavy impacts
  const handleHeavyImpact = useCallback(() => {
    const physicsConfig = getPhysicsConfig(tribeId);
    if (!physicsConfig.effects.cameraShake) return;

    const intensity = physicsConfig.effects.shakeIntensity;
    const duration = 300;
    const startTime = Date.now();

    const shake = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        setCameraShake({ x: 0, y: 0 });
        return;
      }

      const decay = 1 - (elapsed / duration);
      const currentIntensity = intensity * decay;
      
      setCameraShake({
        x: (Math.random() - 0.5) * 20 * currentIntensity,
        y: (Math.random() - 0.5) * 20 * currentIntensity,
      });

      requestAnimationFrame(shake);
    };

    shake();
  }, [tribeId]);

  // Combo chain timeout
  useEffect(() => {
    if (comboChain > 0) {
      // Reset combo after 3 seconds of inactivity
      comboTimeoutRef.current = setTimeout(() => {
        setComboChain(0);
        onCombo?.(0);
      }, 3000);
    }
    
    return () => {
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
      }
    };
  }, [comboChain, onCombo]);

  // Anxiety spike detection (simulated)
  useEffect(() => {
    // Simulate anxiety detection based on rapid failed matches
    const checkAnxiety = setInterval(() => {
      const randomSpike = Math.random() < 0.05; // 5% chance per check
      
      if (randomSpike && anxietyLevel < 3) {
        const newLevel = anxietyLevel + 1;
        setAnxietyLevel(newLevel);
        setShowCorruption(true);
        onAnxietySpike?.(newLevel);
        
        // Clear corruption after engagement
        setTimeout(() => {
          setShowCorruption(false);
        }, 5000);
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(checkAnxiety);
  }, [anxietyLevel, onAnxietySpike]);

  // Initialize grid with random tiles
  const initializeGrid = () => {
    const newGrid: GridTile[] = [];
    
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        // Weighted random: more likely to get current tribe's physics
        const randomTribe = Math.random() < 0.7 ? tribeId : Math.floor(Math.random() * 13);
        
        newGrid.push({
          id: `${x}-${y}`,
          tribeId: randomTribe,
          type: 'gem',
          color: TILE_COLORS[Math.floor(Math.random() * TILE_COLORS.length)],
          x,
          y,
          isMatched: false,
          isSelected: false,
          isFloating: false,
        });
      }
    }
    
    setGrid(newGrid);
  };

  // Get tile at position
  const getTileAt = (x: number, y: number) => {
    return grid.find(t => t.x === x && t.y === y);
  };

  // Get tile by ID
  const getTileById = (id: string) => {
    return grid.find(t => t.id === id);
  };

  // Check if two tiles are adjacent
  const areAdjacent = (id1: string, id2: string) => {
    const tile1 = getTileById(id1);
    const tile2 = getTileById(id2);
    
    if (!tile1 || !tile2) return false;
    
    const dx = Math.abs(tile1.x - tile2.x);
    const dy = Math.abs(tile1.y - tile2.y);
    
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  };

  // Swap two tiles
  const swapTiles = (id1: string, id2: string) => {
    setGrid(prev => {
      const newGrid = [...prev];
      const idx1 = newGrid.findIndex(t => t.id === id1);
      const idx2 = newGrid.findIndex(t => t.id === id2);
      
      if (idx1 === -1 || idx2 === -1) return prev;
      
      const tile1 = { ...newGrid[idx1] };
      const tile2 = { ...newGrid[idx2] };
      
      // Swap positions
      const tempX = tile1.x;
      const tempY = tile1.y;
      tile1.x = tile2.x;
      tile1.y = tile2.y;
      tile2.x = tempX;
      tile2.y = tempY;
      
      newGrid[idx1] = tile1;
      newGrid[idx2] = tile2;
      
      return newGrid;
    });
  };

  // Find matches (3+ in a row)
  const findMatches = () => {
    const matches = new Set<string>();
    
    // Check horizontal matches
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH - 2; x++) {
        const tile1 = getTileAt(x, y);
        const tile2 = getTileAt(x + 1, y);
        const tile3 = getTileAt(x + 2, y);
        
        if (tile1 && tile2 && tile3 && tile1.color === tile2.color && tile2.color === tile3.color) {
          matches.add(tile1.id);
          matches.add(tile2.id);
          matches.add(tile3.id);
          
          // Check for 4+ matches
          const tile4 = getTileAt(x + 3, y);
          if (tile4 && tile4.color === tile1.color) {
            matches.add(tile4.id);
            
            // Check for 5+ (Xibelani Cascade)
            const tile5 = getTileAt(x + 4, y);
            if (tile5 && tile5.color === tile1.color) {
              matches.add(tile5.id);
            }
          }
        }
      }
    }
    
    // Check vertical matches
    for (let x = 0; x < GRID_WIDTH; x++) {
      for (let y = 0; y < GRID_HEIGHT - 2; y++) {
        const tile1 = getTileAt(x, y);
        const tile2 = getTileAt(x, y + 1);
        const tile3 = getTileAt(x, y + 2);
        
        if (tile1 && tile2 && tile3 && tile1.color === tile2.color && tile2.color === tile3.color) {
          matches.add(tile1.id);
          matches.add(tile2.id);
          matches.add(tile3.id);
        }
      }
    }
    
    return Array.from(matches);
  };

  // Process matches
  const processMatches = async () => {
    const matches = findMatches();
    
    if (matches.length === 0) {
      setIsProcessing(false);
      return;
    }
    
    // Check for Match-4 to trigger buoyancy wave
    const isMatch4 = matches.length >= 4;
    if (isMatch4) {
      setBuoyancyWaveActive(true);
      setTimeout(() => setBuoyancyWaveActive(false), 2000);
    }
    
    // Mark matched tiles
    setGrid(prev => prev.map(tile => ({
      ...tile,
      isMatched: matches.includes(tile.id),
    })));
    
    // Calculate resonance gain
    const baseGain = matches.length * 10;
    const cascadeBonus = matches.length >= 5 ? 1.25 : 1; // Xibelani Cascade +25%
    const buoyancyBonus = isMatch4 ? 1.1 : 1; // Match-4 bonus
    const totalGain = Math.floor(baseGain * cascadeBonus * buoyancyBonus);
    
    // Update combo chain
    const newCombo = comboChain + 1;
    setComboChain(newCombo);
    onCombo?.(newCombo);
    onResonanceGain?.(totalGain);
    
    // Wait for match animation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Remove matched tiles and drop new ones
    setGrid(prev => {
      const newGrid = prev.filter(tile => !matches.includes(tile.id));
      
      // Add new tiles at top
      const newTiles: GridTile[] = [];
      matches.forEach((id, index) => {
        const oldTile = prev.find(t => t.id === id);
        if (oldTile) {
          newTiles.push({
            id: `new-${Date.now()}-${index}`,
            tribeId: Math.floor(Math.random() * 13),
            type: 'gem',
            color: TILE_COLORS[Math.floor(Math.random() * TILE_COLORS.length)],
            x: oldTile.x,
            y: -1 - index, // Start above grid
            isMatched: false,
            isSelected: false,
            isFloating: false,
          });
        }
      });
      
      return [...newTiles, ...newGrid];
    });
    
    // Process next set of matches after drop
    setTimeout(() => processMatches(), 500);
  };

  // Handle tile click
  const handleTileClick = (id: string) => {
    if (isProcessing) return;
    
    if (!selectedTile) {
      // Select first tile
      setSelectedTile(id);
      setGrid(prev => prev.map(tile => ({
        ...tile,
        isSelected: tile.id === id,
      })));
    } else if (selectedTile === id) {
      // Deselect
      setSelectedTile(null);
      setGrid(prev => prev.map(tile => ({
        ...tile,
        isSelected: false,
      })));
    } else if (areAdjacent(selectedTile, id)) {
      // Attempt swap
      setIsProcessing(true);
      swapTiles(selectedTile, id);
      setSelectedTile(null);
      
      setGrid(prev => prev.map(tile => ({
        ...tile,
        isSelected: false,
      })));
      
      // Check for matches after swap
      setTimeout(() => processMatches(), 300);
    } else {
      // Select different tile
      setSelectedTile(id);
      setGrid(prev => prev.map(tile => ({
        ...tile,
        isSelected: tile.id === id,
      })));
    }
  };

  // Get grid background based on tribe and KYC level
  const getGridBackground = () => {
    // KYC Level 3: Transparent starlight void
    if (kycLevel >= 3) {
      return {
        backgroundColor: 'transparent',
        backgroundImage: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%)',
      };
    }
    
    if (tribeId === 0) {
      // Khoe-San: Rock texture
      return {
        backgroundColor: '#1a1a1a',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${DESIGN_TOKENS.colors.foundationOchre.slice(1)}' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      };
    }
    
    if (tribeId === 12) {
      // Synthesis: Prismatic
      return {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1b4e 50%, #1a1a1a 100%)',
      };
    }
    
    // Default
    return {
      backgroundColor: '#0f0f1e',
    };
  };

  // Get grid frame style with resonance vibration
  const getGridFrameStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: `repeat(${GRID_WIDTH}, 55px)`,
      gridTemplateRows: `repeat(${GRID_HEIGHT}, 55px)`,
      gap: '5px',
      padding: '20px',
      borderRadius: '12px',
      overflow: 'hidden',
      transform: `translate(${cameraShake.x}px, ${cameraShake.y}px)`,
      transition: 'transform 0.05s ease-out',
    };

    // KYC Level 3: Transparent frame
    if (kycLevel >= 3) {
      return {
        ...baseStyle,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 0 50px rgba(255,255,255,0.1), inset 0 0 100px rgba(0,0,0,0.2)',
      };
    }

    // Standard frame with tribe theming
    return {
      ...baseStyle,
      border: `2px solid ${DESIGN_TOKENS.colors.foundationOchre}30`,
      boxShadow: '0 0 30px rgba(0,0,0,0.5), inset 0 0 50px rgba(0,0,0,0.3)',
    };
  };

  // Get corruption overlay style
  const getCorruptionStyle = (): React.CSSProperties => {
    if (!showCorruption) return { opacity: 0, pointerEvents: 'none' };
    
    const intensity = anxietyLevel / 3;
    
    return {
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(ellipse at center, transparent 40%, rgba(236, 72, 153, ${intensity * 0.3}) 100%)`,
      border: `${intensity * 4}px solid rgba(236, 72, 153, ${intensity * 0.5})`,
      filter: `blur(${intensity * 2}px)`,
      opacity: 1,
      transition: 'all 0.5s ease',
      pointerEvents: 'none',
      zIndex: 50,
    };
  };

  // Get buoyancy wave overlay
  const getBuoyancyWaveStyle = (): React.CSSProperties => {
    if (!buoyancyWaveActive) return { opacity: 0, pointerEvents: 'none' };

    return {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(circle at center, rgba(144,238,144,0.2) 0%, transparent 70%)',
      boxShadow: 'inset 0 0 50px rgba(144,238,144,0.3)',
      opacity: 1,
      transition: 'opacity 0.5s ease',
      pointerEvents: 'none',
      zIndex: 40,
      animation: 'buoyancyWave 2s ease-in-out',
    };
  };

  // Get anxiety indicator
  const getAnxietyIndicator = () => {
    if (anxietyLevel === 0) return null;
    
    const colors = ['#f59e0b', '#ef4444', '#dc2626'];
    const labels = ['Mild', 'Spike', 'Crisis'];
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '0.5rem 1rem',
          background: 'rgba(0, 0, 0, 0.8)',
          border: `1px solid ${colors[anxietyLevel - 1]}`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <motion.span 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: colors[anxietyLevel - 1],
            boxShadow: `0 0 10px ${colors[anxietyLevel - 1]}`,
          }} 
        />
        <span style={{
          fontFamily: DESIGN_TOKENS.typography.data,
          fontSize: '0.7rem',
          color: colors[anxietyLevel - 1],
          letterSpacing: '0.1em',
        }}>
          ANXIETY: {labels[anxietyLevel - 1]}
        </span>
      </motion.div>
    );
  };

  // Get grid lines style based on KYC level
  const getGridLines = () => {
    // KYC Level 3: No visible grid lines (transparent)
    if (kycLevel >= 3) {
      return null;
    }

    return (
      <svg style={styles.gridLines}>
        {/* Vertical lines */}
        {Array.from({ length: GRID_WIDTH + 1 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 55}
            y1={0}
            x2={i * 55}
            y2={GRID_HEIGHT * 55}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: GRID_HEIGHT + 1 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={i * 55}
            x2={GRID_WIDTH * 55}
            y2={i * 55}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}
      </svg>
    );
  };

  return (
    <div style={styles.container}>
      {/* Anxiety Indicator */}
      {getAnxietyIndicator()}
      
      {/* Grid Container with Camera Shake */}
      <motion.div
        ref={gridRef}
        className={`match3-grid tribe-${tribeId} kyc-${kycLevel}`}
        style={{
          ...getGridFrameStyle(),
          ...getGridBackground(),
        }}
        animate={{
          x: cameraShake.x,
          y: cameraShake.y,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {/* Grid Tiles */}
        <AnimatePresence>
          {grid.map(tile => (
            <Tile
              key={tile.id}
              {...tile}
              onClick={() => handleTileClick(tile.id)}
              onAnimationComplete={() => {
                if (tile.isMatched) {
                  setGrid(prev => prev.filter(t => t.id !== tile.id));
                }
              }}
              onHeavyImpact={handleHeavyImpact}
            />
          ))}
        </AnimatePresence>
        
        {/* Corruption Overlay (Anxiety Spike) */}
        <div style={getCorruptionStyle()} />
        
        {/* Buoyancy Wave Overlay (Match-4) */}
        <div style={getBuoyancyWaveStyle()} />
        
        {/* Grid Lines */}
        {getGridLines()}
      </motion.div>
      
      {/* Physics Info Panel */}
      <motion.div 
        style={styles.physicsPanel}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div style={styles.physicsTitle}>
          ANCESTRAL PHYSICS
        </div>
        <div style={styles.physicsStats}>
          <div style={styles.physicsStat}>
            <span style={styles.statLabel}>Tribe:</span>
            <span style={styles.statValue}>
              {tribePhysics?.name || 'Unknown'}
            </span>
          </div>
          <div style={styles.physicsStat}>
            <span style={styles.statLabel}>Mass:</span>
            <span style={styles.statValue}>{tribePhysics?.mass || 0}</span>
          </div>
          <div style={styles.physicsStat}>
            <span style={styles.statLabel}>Buoyancy:</span>
            <span style={styles.statValue}>{tribePhysics?.buoyancy || 0}</span>
          </div>
        </div>
        <div style={styles.physicsHint}>
          {tribePhysics && tribePhysics.mass > 120 && '⚓ Heavy drop - metallic clank'}
          {tribePhysics && tribePhysics.buoyancy > 70 && '🪶 Floats like feathers'}
        </div>
        
        {/* KYC Level Indicator */}
        {kycLevel >= 3 && (
          <div style={styles.kycIndicator}>
            <span style={styles.kycText}>BRIDGE-WALKER MODE</span>
            <span style={styles.kycSubtext}>Starlight Void Active</span>
          </div>
        )}
      </motion.div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes buoyancyWave {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

// Styles
const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  gridLines: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
  },
  physicsPanel: {
    padding: '0.75rem 1rem',
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '8px',
    border: `1px solid ${DESIGN_TOKENS.colors.digitalCyan}30`,
    backdropFilter: 'blur(10px)',
  },
  physicsTitle: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.6rem',
    color: DESIGN_TOKENS.colors.digitalCyan,
    letterSpacing: '0.2em',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  physicsStats: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  physicsStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.5rem',
    color: '#9ca3af',
  },
  statValue: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.75rem',
    color: '#fff',
    fontWeight: 'bold',
  },
  physicsHint: {
    marginTop: '0.5rem',
    fontFamily: DESIGN_TOKENS.typography.dialogue,
    fontSize: '0.65rem',
    color: DESIGN_TOKENS.colors.resonanceGold,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  kycIndicator: {
    marginTop: '0.75rem',
    padding: '0.5rem',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.3)',
    textAlign: 'center',
  },
  kycText: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.6rem',
    color: '#fff',
    letterSpacing: '0.15em',
    display: 'block',
  },
  kycSubtext: {
    fontFamily: DESIGN_TOKENS.typography.dialogue,
    fontSize: '0.55rem',
    color: '#9ca3af',
    fontStyle: 'italic',
  },
};

export default Match3Grid;
