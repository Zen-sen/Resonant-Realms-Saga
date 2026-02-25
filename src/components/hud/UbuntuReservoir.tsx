import React, { useEffect, useState } from 'react';
import { DESIGN_TOKENS } from '../../hooks/useUIState';

interface UbuntuReservoirProps {
  ubuntuPoints: number;
  reservoirLevel: number; // 0-100 percentage
  isPulsing?: boolean;    // Triggered on Mercy events
  tribeId?: number;       // Affects color theming
}

/**
 * @component UbuntuReservoir
 * The Ubuntu Reservoir - A vertical glass tube filled with liquid "Molten Sun."
 * 
 * Visual Logic:
 * - Linked to UbuntuPointsFacet
 * - Fills with liquid Amber based on total Ubuntu Points
 * - Pulses with golden glow when Mercy event triggered (forgiving a lost streak)
 * - Vertical glass tube aesthetic with liquid physics simulation
 * 
 * Contract Mapping:
 * - Data Source: LibAppStorage.totalUbuntuPoints[msg.sender]
 * - Mercy Pulse: Triggered by adversaryBuffer > 0 in experimentData
 */
export function UbuntuReservoir({ 
  ubuntuPoints, 
  reservoirLevel, 
  isPulsing = false,
  tribeId = 0 
}: UbuntuReservoirProps) {
  const [pulseActive, setPulseActive] = useState(false);
  
  // Trigger pulse animation when isPulsing prop changes
  useEffect(() => {
    if (isPulsing) {
      setPulseActive(true);
      const timer = setTimeout(() => setPulseActive(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isPulsing]);

  // Determine colors based on tribe
  const getReservoirColor = () => {
    if (tribeId === 0) return DESIGN_TOKENS.colors.resonanceGold; // Khoe-San: Amber
    if (tribeId === 12) return 'url(#prismGradient)'; // Synthesis: Prismatic
    return DESIGN_TOKENS.colors.resonanceGold; // Default gold
  };

  // Format UP display
  const formatUP = (points: number) => {
    if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`;
    if (points >= 1000) return `${(points / 1000).toFixed(1)}K`;
    return points.toString();
  };

  return (
    <div className="ubuntu-reservoir-container" style={styles.container}>
      {/* Label */}
      <div style={styles.label}>
        <span style={styles.labelText}>UBUNTU</span>
        <span style={styles.labelSubtext}>RESERVOIR</span>
      </div>

      {/* Glass Tube */}
      <div 
        className={`reservoir-tube ${pulseActive ? 'pulse-active' : ''}`}
        style={{
          ...styles.tube,
          boxShadow: pulseActive 
            ? `0 0 30px ${DESIGN_TOKENS.colors.resonanceGold}, inset 0 0 20px rgba(255, 191, 0, 0.3)`
            : `inset 0 0 10px rgba(255, 191, 0, 0.1), 0 0 10px rgba(0,0,0,0.5)`,
        }}
      >
        {/* SVG Gradient Definition for Synthesis Tribe */}
        {tribeId === 12 && (
          <svg width="0" height="0">
            <defs>
              <linearGradient id="prismGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FF0000" />
                <stop offset="16%" stopColor="#FF7F00" />
                <stop offset="33%" stopColor="#FFFF00" />
                <stop offset="50%" stopColor="#00FF00" />
                <stop offset="66%" stopColor="#0000FF" />
                <stop offset="83%" stopColor="#4B0082" />
                <stop offset="100%" stopColor="#9400D3" />
              </linearGradient>
            </defs>
          </svg>
        )}

        {/* Liquid Fill */}
        <div 
          className="reservoir-liquid"
          style={{
            ...styles.liquid,
            height: `${Math.max(5, reservoirLevel)}%`,
            background: tribeId === 12 
              ? 'linear-gradient(180deg, #FF0000 0%, #FF7F00 16%, #FFFF00 33%, #00FF00 50%, #0000FF 66%, #4B0082 83%, #9400D3 100%)'
              : `linear-gradient(180deg, 
                  ${DESIGN_TOKENS.colors.resonanceGold} 0%, 
                  ${DESIGN_TOKENS.colors.foundationOchre} 50%,
                  #8B4513 100%)`,
            boxShadow: pulseActive 
              ? `0 0 40px ${DESIGN_TOKENS.colors.resonanceGold}, inset 0 0 20px rgba(255, 255, 255, 0.5)`
              : `0 0 15px ${DESIGN_TOKENS.colors.resonanceGold}`,
            animation: pulseActive ? 'liquidPulse 2s ease-in-out' : 'liquidShimmer 3s ease-in-out infinite',
          }}
        >
          {/* Bubbles Animation */}
          <div style={styles.bubblesContainer}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bubble"
                style={{
                  ...styles.bubble,
                  left: `${20 + (i * 15)}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${2 + (i * 0.3)}s`,
                }}
              />
            ))}
          </div>

          {/* Surface Ripple */}
          <div 
            className="liquid-surface"
            style={{
              ...styles.liquidSurface,
              animation: pulseActive ? 'surfaceRipple 0.5s ease-in-out' : 'none',
            }}
          />
        </div>

        {/* Glass Reflection */}
        <div style={styles.glassReflection} />

        {/* Measurement Markers */}
        <div style={styles.markers}>
          {[100, 75, 50, 25, 0].map((mark) => (
            <div key={mark} style={styles.marker}>
              <span style={styles.markerText}>{mark}%</span>
              <div style={styles.markerLine} />
            </div>
          ))}
        </div>
      </div>

      {/* Value Display */}
      <div style={styles.valueDisplay}>
        <span style={styles.valueNumber}>{formatUP(ubuntuPoints)}</span>
        <span style={styles.valueUnit}>UP</span>
        {pulseActive && (
          <div style={styles.mercyIndicator}>
            <span style={styles.mercyText}>MERCY ACTIVE</span>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes liquidPulse {
          0%, 100% { transform: scaleY(1); filter: brightness(1); }
          50% { transform: scaleY(1.05); filter: brightness(1.3); }
        }
        
        @keyframes liquidShimmer {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }
        
        @keyframes surfaceRipple {
          0% { transform: scaleX(1); }
          50% { transform: scaleX(1.1); }
          100% { transform: scaleX(1); }
        }
        
        @keyframes bubbleRise {
          0% { 
            transform: translateY(0) scale(0.5); 
            opacity: 0; 
          }
          10% { 
            opacity: 0.8; 
          }
          90% { 
            opacity: 0.8; 
          }
          100% { 
            transform: translateY(-100px) scale(1.2); 
            opacity: 0; 
          }
        }
        
        .bubble {
          animation: bubbleRise 3s ease-in-out infinite;
        }
        
        .pulse-active {
          animation: tubePulse 2s ease-in-out;
        }
        
        @keyframes tubePulse {
          0%, 100% { border-color: rgba(255, 191, 0, 0.3); }
          50% { border-color: rgba(255, 191, 0, 0.8); }
        }
      `}</style>
    </div>
  );
}

// Styles
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    border: `1px solid ${DESIGN_TOKENS.colors.foundationOchre}30`,
    backdropFilter: 'blur(10px)',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  labelText: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.7rem',
    color: DESIGN_TOKENS.colors.resonanceGold,
    letterSpacing: '0.2em',
    fontWeight: 'bold',
  },
  labelSubtext: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.6rem',
    color: '#9ca3af',
    letterSpacing: '0.15em',
  },
  tube: {
    position: 'relative',
    width: '60px',
    height: '200px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)',
    borderRadius: '30px',
    border: '2px solid rgba(255, 191, 0, 0.3)',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease',
  },
  liquid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: '0 0 28px 28px',
    transition: 'height 0.5s ease-out, box-shadow 0.3s ease',
    minHeight: '10px',
  },
  bubblesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    bottom: '10px',
    width: '6px',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: '50%',
    boxShadow: '0 0 4px rgba(255, 191, 0, 0.8)',
  },
  liquidSurface: {
    position: 'absolute',
    top: 0,
    left: '-10%',
    right: '-10%',
    height: '4px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
    borderRadius: '50%',
  },
  glassReflection: {
    position: 'absolute',
    top: '10%',
    left: '15%',
    width: '20%',
    height: '80%',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
    borderRadius: '20px',
    pointerEvents: 'none',
  },
  markers: {
    position: 'absolute',
    right: '5px',
    top: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '10px 0',
  },
  marker: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  markerText: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.5rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  markerLine: {
    width: '8px',
    height: '1px',
    background: 'rgba(255, 255, 255, 0.3)',
  },
  valueDisplay: {
    marginTop: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  valueNumber: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '1.2rem',
    color: DESIGN_TOKENS.colors.resonanceGold,
    textShadow: `0 0 10px ${DESIGN_TOKENS.colors.resonanceGold}50`,
    fontWeight: 'bold',
  },
  valueUnit: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.6rem',
    color: '#9ca3af',
    letterSpacing: '0.1em',
  },
  mercyIndicator: {
    marginTop: '0.5rem',
    padding: '0.25rem 0.5rem',
    background: `linear-gradient(135deg, ${DESIGN_TOKENS.colors.resonanceGold}30, ${DESIGN_TOKENS.colors.foundationOchre}30)`,
    borderRadius: '4px',
    border: `1px solid ${DESIGN_TOKENS.colors.resonanceGold}50`,
    animation: 'pulse 1s ease-in-out infinite',
  },
  mercyText: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.5rem',
    color: DESIGN_TOKENS.colors.resonanceGold,
    letterSpacing: '0.15em',
    fontWeight: 'bold',
  },
};

export default UbuntuReservoir;
