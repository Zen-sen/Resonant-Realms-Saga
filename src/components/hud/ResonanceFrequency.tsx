import React, { useEffect, useRef, useState } from 'react';
import { DESIGN_TOKENS } from '../../hooks/useUIState';

interface ResonanceFrequencyProps {
  frequency: number;      // Current frequency in Hz (44 default, 88 during combos)
  resonance: number;      // Total resonance points
  comboChain: number;     // Current combo count
  isActive?: boolean;     // Whether the wave should animate
  tribeId?: number;       // Affects color theming
}

/**
 * @component ResonanceFrequency
 * The Resonance Frequency - A horizontal sine-wave that vibrates at 44Hz (default)
 * and spikes to 88Hz during high-combo chains.
 * 
 * Visual Logic:
 * - Linked to ResonanceFacet
 * - Horizontal oscilloscope display with sine-wave
 * - Base frequency: 44Hz (resting state)
 * - Spike frequency: 88Hz during high-combo chains (5+ matches)
 * - Wave amplitude increases with combo count
 * 
 * Contract Mapping:
 * - Data Source: ResonanceFacet.playerResonance[msg.sender]
 * - Combo Trigger: recordResonanceCascade() for 5+ matches
 */
export function ResonanceFrequency({ 
  frequency, 
  resonance, 
  comboChain, 
  isActive = true,
  tribeId = 0 
}: ResonanceFrequencyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [wavePhase, setWavePhase] = useState(0);

  // Determine colors based on tribe and frequency
  const getWaveColor = () => {
    if (tribeId === 12) return '#FFFFFF'; // Synthesis: White light
    if (frequency >= 80) return DESIGN_TOKENS.colors.resonanceGold; // High frequency: Gold
    if (tribeId === 0) return DESIGN_TOKENS.colors.foundationOchre; // Khoe-San: Ochre
    return DESIGN_TOKENS.colors.digitalCyan; // Default: Cyan
  };

  // Determine glow color
  const getGlowColor = () => {
    if (tribeId === 12) return 'rgba(255, 255, 255, 0.8)';
    if (frequency >= 80) return 'rgba(255, 191, 0, 0.8)';
    return 'rgba(6, 182, 212, 0.6)';
  };

  // Wave animation using Canvas API
  useEffect(() => {
    if (!canvasRef.current || !isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();

    let phase = 0;
    const baseAmplitude = 20;
    const maxAmplitude = 50;
    
    // Amplitude increases with combo chain
    const amplitude = baseAmplitude + (Math.min(comboChain, 10) / 10) * (maxAmplitude - baseAmplitude);
    
    // Speed based on frequency (44Hz to 88Hz)
    const speed = (frequency / 44) * 0.1;

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerY = height / 2;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw grid lines (oscilloscope style)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      
      // Horizontal grid
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Vertical grid
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw the sine wave
      ctx.beginPath();
      ctx.strokeStyle = getWaveColor();
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = getGlowColor();

      // Create composite wave for more interesting pattern
      for (let x = 0; x < width; x++) {
        // Primary sine wave
        const primaryWave = Math.sin((x * 0.02) + phase) * amplitude;
        
        // Secondary harmonic (doubles frequency for richness)
        const harmonicWave = Math.sin((x * 0.04) + phase * 1.5) * (amplitude * 0.3);
        
        // Tertiary wave for complexity at high frequencies
        const tertiaryWave = frequency > 60 
          ? Math.sin((x * 0.08) + phase * 2) * (amplitude * 0.15)
          : 0;

        const y = centerY + primaryWave + harmonicWave + tertiaryWave;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw center line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Update phase for animation
      phase += speed;
      setWavePhase(phase);

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    // Handle resize
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [frequency, comboChain, isActive, tribeId]);

  // Calculate frequency display color
  const getFrequencyColor = () => {
    if (frequency >= 80) return DESIGN_TOKENS.colors.resonanceGold;
    if (frequency >= 60) return DESIGN_TOKENS.colors.foundationOchre;
    return DESIGN_TOKENS.colors.digitalCyan;
  };

  // Determine resonance state label
  const getResonanceState = () => {
    if (comboChain >= 5) return 'XIBELANI CASCADE';
    if (comboChain >= 3) return 'RESONANCE BUILDING';
    if (frequency >= 60) return 'HARMONIC ACTIVE';
    return 'RESTING STATE';
  };

  return (
    <div className="resonance-frequency-container" style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.labelGroup}>
          <span style={styles.labelText}>RESONANCE</span>
          <span style={styles.labelSubtext}>FREQUENCY</span>
        </div>
        <div style={styles.valueGroup}>
          <span 
            style={{
              ...styles.frequencyValue,
              color: getFrequencyColor(),
              textShadow: `0 0 10px ${getFrequencyColor()}50`,
            }}
          >
            {frequency.toFixed(0)}
          </span>
          <span style={styles.frequencyUnit}>Hz</span>
        </div>
      </div>

      {/* Oscilloscope Display */}
      <div 
        style={{
          ...styles.oscilloscope,
          borderColor: tribeId === 12 
            ? 'rgba(255, 255, 255, 0.3)' 
            : `${getFrequencyColor()}40`,
          boxShadow: `inset 0 0 20px ${getGlowColor()}20`,
        }}
      >
        <canvas 
          ref={canvasRef}
          style={styles.canvas}
          className={comboChain >= 5 ? 'cascade-active' : ''}
        />
        
        {/* Overlay Effects */}
        {comboChain >= 5 && (
          <div style={styles.cascadeOverlay}>
            <span style={styles.cascadeText}>⚡ CASCADE ⚡</span>
          </div>
        )}

        {/* Scanline Effect */}
        <div style={styles.scanline} />
      </div>

      {/* Metrics Bar */}
      <div style={styles.metricsBar}>
        <div style={styles.metric}>
          <span style={styles.metricLabel}>RESONANCE</span>
          <span style={styles.metricValue}>{resonance.toLocaleString()}</span>
        </div>
        
        <div style={styles.metric}>
          <span style={styles.metricLabel}>COMBO</span>
          <span 
            style={{
              ...styles.metricValue,
              color: comboChain >= 5 ? DESIGN_TOKENS.colors.resonanceGold : '#9ca3af',
            }}
          >
            {comboChain}x
          </span>
        </div>

        <div style={styles.stateIndicator}>
          <div 
            style={{
              ...styles.stateDot,
              backgroundColor: getFrequencyColor(),
              boxShadow: `0 0 10px ${getFrequencyColor()}`,
            }} 
          />
          <span style={styles.stateText}>{getResonanceState()}</span>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes cascadePulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        .cascade-active {
          animation: cascadePulse 0.5s ease-in-out infinite;
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
    padding: '1rem',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '12px',
    border: `1px solid ${DESIGN_TOKENS.colors.foundationOchre}30`,
    backdropFilter: 'blur(10px)',
    minWidth: '300px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  labelGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  labelText: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.7rem',
    color: DESIGN_TOKENS.colors.digitalCyan,
    letterSpacing: '0.2em',
    fontWeight: 'bold',
  },
  labelSubtext: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.6rem',
    color: '#9ca3af',
    letterSpacing: '0.15em',
  },
  valueGroup: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.25rem',
  },
  frequencyValue: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
  },
  frequencyUnit: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.8rem',
    color: '#9ca3af',
  },
  oscilloscope: {
    position: 'relative',
    height: '100px',
    background: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '8px',
    border: '2px solid rgba(6, 182, 212, 0.3)',
    overflow: 'hidden',
    marginBottom: '0.75rem',
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  cascadeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 191, 0, 0.1)',
    pointerEvents: 'none',
  },
  cascadeText: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.9rem',
    color: DESIGN_TOKENS.colors.resonanceGold,
    letterSpacing: '0.3em',
    fontWeight: 'bold',
    textShadow: `0 0 20px ${DESIGN_TOKENS.colors.resonanceGold}`,
  },
  scanline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)',
    animation: 'scanline 3s linear infinite',
    pointerEvents: 'none',
  },
  metricsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '6px',
  },
  metric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.5rem',
    color: '#9ca3af',
    letterSpacing: '0.1em',
  },
  metricValue: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.9rem',
    color: '#fff',
    fontWeight: 'bold',
  },
  stateIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  stateDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    transition: 'all 0.3s ease',
  },
  stateText: {
    fontFamily: DESIGN_TOKENS.typography.data,
    fontSize: '0.6rem',
    color: '#9ca3af',
    letterSpacing: '0.1em',
  },
};

export default ResonanceFrequency;
