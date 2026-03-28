import React, { useEffect, useState } from 'react';
import { DESIGN_TOKENS } from '../../hooks/useUIState';

interface ArchitectSealProps {
  kycLevel: number;       // 0-3: None, Basic, Advanced, Enterprise
  isVerified: boolean;
  verifiedAt?: number;    // Timestamp
  tribeId?: number;       // Affects visual style
  showDetails?: boolean;  // Show expanded info
}

/**
 * @component ArchitectSeal
 * The Architect's Seal - A shield icon that evolves based on KYC Level.
 * 
 * Visual Logic:
 * - Linked to KycVerificationFacet
 * - Level 0: Cracked stone texture, dim, no glow
 * - Level 1: Polished stone, soft amber glow
 * - Level 2: Bronze metallic sheen, pulsing rhythm
 * - Level 3: Iridescent diamond, prismatic refraction, radiant aura
 * 
 * Contract Mapping:
 * - Data Source: KycVerificationFacet.getKycStatus(msg.sender)
 * - Level Check: KycVerificationFacet.getKycLevel(msg.sender)
 * - Gate Check: KycVerificationFacet.isKycVerified(msg.sender, minLevel)
 */
export function ArchitectSeal({ 
  kycLevel, 
  isVerified, 
  verifiedAt, 
  tribeId = 0,
  showDetails = false 
}: ArchitectSealProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Trigger animation when level changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [kycLevel]);

  // Get seal configuration based on KYC level
  const getSealConfig = () => {
    const baseConfig = {
      size: 80,
      strokeWidth: 2,
      animation: '',
    };

    switch (kycLevel) {
      case 0: // None - Cracked Stone
        return {
          ...baseConfig,
          name: 'UNVERIFIED',
          color: '#6b7280', // Gray
          glowColor: 'transparent',
          secondaryColor: '#4b5563',
          texture: 'cracked',
          glowIntensity: 0,
          pulseSpeed: 0,
          icon: '⛔',
          description: 'Identity not verified',
        };
      
      case 1: // Basic - Polished Stone
        return {
          ...baseConfig,
          name: 'SEEKER',
          color: DESIGN_TOKENS.colors.foundationOchre,
          glowColor: `${DESIGN_TOKENS.colors.foundationOchre}40`,
          secondaryColor: '#8B4513',
          texture: 'polished',
          glowIntensity: 10,
          pulseSpeed: 3,
          icon: '🛡️',
          description: 'Basic identity verified',
        };
      
      case 2: // Advanced - Bronze
        return {
          ...baseConfig,
          name: 'GUARDIAN',
          color: '#CD7F32', // Bronze
          glowColor: 'rgba(205, 127, 50, 0.5)',
          secondaryColor: '#8B4513',
          texture: 'metallic',
          glowIntensity: 20,
          pulseSpeed: 2,
          icon: '⚔️',
          description: 'Advanced verification complete',
        };
      
      case 3: // Enterprise - Iridescent Diamond
        return {
          ...baseConfig,
          name: 'BRIDGE-WALKER',
          color: '#E0E0E0', // Diamond white
          glowColor: 'rgba(255, 255, 255, 0.8)',
          secondaryColor: '#C0C0C0',
          texture: 'prismatic',
          glowIntensity: 40,
          pulseSpeed: 1,
          icon: '💎',
          description: 'Enterprise verification - Full trust',
        };
      
      default:
        return {
          ...baseConfig,
          name: 'UNKNOWN',
          color: '#6b7280',
          glowColor: 'transparent',
          secondaryColor: '#4b5563',
          texture: 'none',
          glowIntensity: 0,
          pulseSpeed: 0,
          icon: '❓',
          description: 'Status unknown',
        };
    }
  };

  const config = getSealConfig();

  // Format verification date
  const formatVerifiedDate = (timestamp?: number) => {
    if (!timestamp) return 'Not verified';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get tribal sigil based on tribeId
  const getTribalSigil = () => {
    const sigils = [
      '◈', // Khoe-San - Diamond (foundation)
      '⚡', // Zulu - Lightning
      '≋', // Xhosa - Waves
      '▲', // Sotho - Mountain
      '☔', // Setswana - Rain
      '☘', // Sepedi - Healing
      '✺', // Xitsonga - Star/Spin
      '🌿', // Swati - Reed
      '🔮', // Venda - Mystic
      '◼', // isiNdebele - Geometric
      '🌊', // Tsonga - Ocean
      '🔨', // Afrikaans - Forge
      '◉', // Synthesis - Circle/Integration
    ];
    return sigils[tribeId] || sigils[0];
  };

  // Calculate shield path based on level
  const getShieldPath = () => {
    // Classic heater shield shape
    return "M40,5 L75,15 L75,40 C75,65 40,85 40,85 C40,85 5,65 5,40 L5,15 Z";
  };

  return (
    <div 
      className="architect-seal-container"
      style={styles.container}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Label */}
      <div style={styles.label}>
        <span style={styles.labelText}>ARCHITECT'S</span>
        <span style={styles.labelSubtext}>SEAL</span>
      </div>

      {/* Shield SVG */}
      <div 
        style={{
          ...styles.shieldWrapper,
          filter: `drop-shadow(0 0 ${config.glowIntensity}px ${config.glowColor})`,
          animation: config.pulseSpeed > 0 ? `shieldPulse ${config.pulseSpeed}s ease-in-out infinite` : 'none',
        }}
      >
        <svg 
          width="80" 
          height="90" 
          viewBox="0 0 80 90"
          className={isAnimating ? 'level-up-animation' : ''}
          style={{
            animation: isAnimating ? 'levelUpPulse 1s ease-in-out' : 'none',
          }}
        >
          {/* Definitions for gradients and filters */}
          <defs>
            {/* Cracked texture pattern for Level 0 */}
            {kycLevel === 0 && (
              <pattern id="cracks" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M0,10 L8,12 M12,5 L15,15 M5,18 L10,8" 
                  stroke="#4b5563" 
                  strokeWidth="0.5" 
                  fill="none"
                />
              </pattern>
            )}
            
            {/* Metallic gradient for Level 2 */}
            {kycLevel === 2 && (
              <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CD7F32" />
                <stop offset="50%" stopColor="#8B4513" />
                <stop offset="100%" stopColor="#CD7F32" />
              </linearGradient>
            )}
            
            {/* Prismatic gradient for Level 3 */}
            {kycLevel === 3 && (
              <linearGradient id="prismaticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF0000" />
                <stop offset="16%" stopColor="#FF7F00" />
                <stop offset="33%" stopColor="#FFFF00" />
                <stop offset="50%" stopColor="#00FF00" />
                <stop offset="66%" stopColor="#0000FF" />
                <stop offset="83%" stopColor="#4B0082" />
                <stop offset="100%" stopColor="#9400D3" />
              </linearGradient>
            )}
            
            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Shield Background */}
          <path
            d={getShieldPath()}
            fill={kycLevel === 2 ? 'url(#bronzeGradient)' : kycLevel === 3 ? 'url(#prismaticGradient)' : config.color}
            stroke={config.secondaryColor}
            strokeWidth={config.strokeWidth}
            opacity={isVerified ? 0.9 : 0.4}
            style={{
              filter: kycLevel >= 2 ? 'url(#glow)' : 'none',
            }}
          />

          {/* Cracked overlay for Level 0 */}
          {kycLevel === 0 && (
            <path
              d={getShieldPath()}
              fill="url(#cracks)"
              opacity={0.6}
            />
          )}

          {/* Tribal Sigil */}
          <text
            x="40"
            y="50"
            textAnchor="middle"
            fontSize="24"
            fill={kycLevel === 3 ? '#fff' : kycLevel >= 2 ? '#fff' : '#1f2937'}
            style={{
              filter: kycLevel >= 2 ? 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' : 'none',
              fontFamily: 'serif',
            }}
          >
            {getTribalSigil()}
          </text>

          {/* Level Indicator Stars */}
          <g transform="translate(40, 75)">
            {[...Array(3)].map((_, i) => (
              <text
                key={i}
                x={(i - 1) * 12}
                y="0"
                textAnchor="middle"
                fontSize="10"
                fill={i < kycLevel ? DESIGN_TOKENS.colors.resonanceGold : '#4b5563'}
                style={{
                  filter: i < kycLevel ? `drop-shadow(0 0 3px ${DESIGN_TOKENS.colors.resonanceGold})` : 'none',
                }}
              >
                ★
              </text>
            ))}
          </g>

          {/* Prismatic rays for Level 3 */}
          {kycLevel === 3 && (
            <g opacity="0.3">
              {[...Array(8)].map((_, i) => (
                <line
                  key={i}
                  x1="40"
                  y1="45"
                  x2={40 + 35 * Math.cos((i * Math.PI) / 4)}
                  y2={45 + 35 * Math.sin((i * Math.PI) / 4)}
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              ))}
            </g>
          )}
        </svg>

        {/* Status Icon Badge */}
        <div 
          style={{
            ...styles.statusBadge,
            backgroundColor: isVerified ? DESIGN_TOKENS.colors.emeraldPulse : '#ef4444',
            boxShadow: isVerified 
              ? `0 0 10px ${DESIGN_TOKENS.colors.emeraldPulse}` 
              : '0 0 5px rgba(239, 68, 68, 0.5)',
          }}
        >
          <span style={styles.statusIcon}>{isVerified ? '✓' : '✗'}</span>
        </div>
      </div>

      {/* Level Name */}
      <div style={styles.levelName}>
        <span 
          style={{
            ...styles.levelText,
            color: config.color,
            textShadow: kycLevel >= 2 ? `0 0 10px ${config.glowColor}` : 'none',
          }}
        >
          {config.name}
        </span>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <div style={styles.detailsPanel}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Level:</span>
            <span style={styles.detailValue}>{kycLevel}/3</span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Status:</span>
            <span style={{
              ...styles.detailValue,
              color: isVerified ? DESIGN_TOKENS.colors.emeraldPulse : '#ef4444',
            }}>
              {isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Since:</span>
            <span style={styles.detailValue}>{formatVerifiedDate(verifiedAt)}</span>
          </div>
          <div style={styles.detailDescription}>
            {config.description}
          </div>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && !showDetails && (
        <div style={styles.tooltip}>
          <div style={styles.tooltipTitle}>{config.name}</div>
          <div style={styles.tooltipDesc}>{config.description}</div>
          <div style={styles.tooltipHint}>
            {kycLevel < 3 ? 'Complete KYC to upgrade' : 'Maximum level achieved'}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes shieldPulse {
          0%, 100% { filter: drop-shadow(0 0 ${config.glowIntensity * 0.5}px ${config.glowColor}); }
          50% { filter: drop-shadow(0 0 ${config.glowIntensity}px ${config.glowColor}); }
        }
        
        @keyframes levelUpPulse {
          0% { transform: scale(1); }
          25% { transform: scale(1.1); filter: brightness(1.3); }
          50% { transform: scale(1.05); filter: brightness(1.5); }
          100% { transform: scale(1); filter: brightness(1); }
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
    padding: '1rem',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    border: `1px solid ${DESIGN_TOKENS.colors.foundationOchre}30`,
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  labelText: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.6rem',
    color: DESIGN_TOKENS.colors.digitalCyan,
    letterSpacing: '0.2em',
    fontWeight: 'bold',
  },
  labelSubtext: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.5rem',
    color: '#9ca3af',
    letterSpacing: '0.15em',
  },
  shieldWrapper: {
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  statusBadge: {
    position: 'absolute',
    bottom: '5px',
    right: '5px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(0, 0, 0, 0.5)',
    transition: 'all 0.3s ease',
  },
  statusIcon: {
    fontSize: '12px',
    color: '#fff',
    fontWeight: 'bold',
  },
  levelName: {
    marginTop: '0.5rem',
    textAlign: 'center',
  },
  levelText: {
    fontFamily: DESIGN_TOKENS.typography.title,
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  detailsPanel: {
    marginTop: '0.75rem',
    padding: '0.75rem',
    background: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    width: '100%',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.25rem',
  },
  detailLabel: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.6rem',
    color: '#9ca3af',
  },
  detailValue: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.6rem',
    color: '#fff',
    fontWeight: 'bold',
  },
  detailDescription: {
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    fontFamily: DESIGN_TOKENS.typography.dialogue,
    fontSize: '0.65rem',
    color: '#d1d5db',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tooltip: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginTop: '0.5rem',
    padding: '0.75rem',
    background: 'rgba(0, 0, 0, 0.9)',
    borderRadius: '8px',
    border: `1px solid ${DESIGN_TOKENS.colors.foundationOchre}50`,
    backdropFilter: 'blur(10px)',
    zIndex: 100,
    minWidth: '150px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
  tooltipTitle: {
    fontFamily: DESIGN_TOKENS.typography.title,
    fontSize: '0.7rem',
    color: DESIGN_TOKENS.colors.resonanceGold,
    letterSpacing: '0.1em',
    fontWeight: 'bold',
    marginBottom: '0.25rem',
    textAlign: 'center',
  },
  tooltipDesc: {
    fontFamily: DESIGN_TOKENS.typography.dialogue,
    fontSize: '0.6rem',
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  tooltipHint: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.5rem',
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '0.5rem',
  },
};

export default ArchitectSeal;
