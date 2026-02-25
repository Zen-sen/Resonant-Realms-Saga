import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRIBE_PHYSICS, DESIGN_TOKENS } from '../../hooks/useUIState';
import { getPhysicsConfig, usePhysicsEngine } from '../../hooks/usePhysicsEngine';


export interface TileProps {
  id: string;
  tribeId: number;        // 0-12 determines physics
  type: 'gem' | 'relic' | 'ancestral';
  color: string;
  x: number;              // Grid X position
  y: number;              // Grid Y position (0 = top)
  isMatched?: boolean;
  isSelected?: boolean;
  isFloating?: boolean;   // From TilePhysics in contract
  onClick?: () => void;
  onAnimationComplete?: () => void;
  onHeavyImpact?: () => void; // Trigger camera shake for heavy tiles
}

// Bubble particle for buoyant tiles (Tribe 5)
interface Bubble {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

// Trail segment for heavy tiles (Tribe 11)
interface TrailSegment {
  x: number;
  y: number;
  opacity: number;
}


/**
 * @component Tile
 * Individual Match-3 tile with Ancestral Physics.
 * 
 * Physics Logic (from AncestralUtils.sol):
 * - Tribe 11 (Afrikaans): Mass 130, Buoyancy 25 → Heavy metallic "clank"
 * - Tribe 5 (Sepedi): Mass 50, Buoyancy 90 → Floats like feathers
 * - Tribe 0 (Khoe-San): Mass 150, Buoyancy 0 → Heavy, grounded
 * - Tribe 12 (Synthesis): Mass 70, Buoyancy 80 → Prismatic, shifting
 * 
 * Contract Mapping:
 * - Physics Source: ResonanceFacet.getEntityPhysics(bunnyId)
 * - Tribe Source: AncestralHeritageFacet.getPlayerStats()
 */
export function Tile({
  id,
  tribeId,
  type,
  color,
  x,
  y,
  isMatched = false,
  isSelected = false,
  isFloating = false,
  onClick,
  onAnimationComplete,
  onHeavyImpact,
}: TileProps) {
  const [position, setPosition] = useState({ x, y });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [trails, setTrails] = useState<TrailSegment[]>([]);
  const tileRef = useRef<HTMLDivElement>(null);

  // Get physics properties for this tribe
  const physics = TRIBE_PHYSICS[tribeId] || TRIBE_PHYSICS[0];
  const physicsConfig = getPhysicsConfig(tribeId);
  const { playPhysicsSound } = usePhysicsEngine();

  // Generate bubbles for buoyant tiles
  useEffect(() => {
    if (physicsConfig.effects.bubbleParticles && isDropping) {
      const newBubbles: Bubble[] = Array.from({ length: physicsConfig.effects.bubbleCount }, (_, i) => ({
        id: Date.now() + i,
        x: 20 + Math.random() * 60, // Random horizontal position
        size: 2 + Math.random() * 4, // Random size 2-6px
        delay: Math.random() * 0.5, // Random delay
        duration: 2 + Math.random() * 2, // Random duration 2-4s
      }));
      setBubbles(newBubbles);
    }
  }, [physicsConfig.effects.bubbleParticles, physicsConfig.effects.bubbleCount, isDropping]);

  // Generate trails for heavy tiles during drop
  useEffect(() => {
    if (physicsConfig.effects.visualTrails && isDropping) {
      const interval = setInterval(() => {
        setTrails(prev => {
          const newTrail = { x: position.x * 55 + 25, y: position.y * 55 + 25, opacity: 0.4 };
          const updated = [...prev, newTrail].slice(-physicsConfig.effects.trailLength);
          return updated;
        });
      }, 50);

      return () => clearInterval(interval);
    } else if (!isDropping) {
      setTrails([]);
    }
  }, [physicsConfig.effects.visualTrails, physicsConfig.effects.trailLength, isDropping, position]);

  
  // Get Framer Motion transition from physics config
  const getMotionTransition = () => {
    return physicsConfig.transition;
  };

  // Calculate drop duration based on physics config
  const getDropDuration = () => {
    if (physicsConfig.visualTreatment === 'heavy') {
      return 400; // Fast, heavy drop
    } else if (physicsConfig.visualTreatment === 'buoyant') {
      return 1500; // Slow, floating drop
    } else if (physicsConfig.visualTreatment === 'synthesis') {
      return 800; // Balanced
    }
    return 600; // Standard
  };


  // Play sound effect using physics engine
  const triggerSound = () => {
    if (soundPlayed) return;
    playPhysicsSound(tribeId);
    setSoundPlayed(true);
  };


  // Handle drop animation when Y position changes
  useEffect(() => {
    if (y !== position.y) {
      setIsDropping(true);
      setSoundPlayed(false);
      
      const duration = getDropDuration();
      
      // Play sound at end of drop for heavy tiles
      if (physicsConfig.visualTreatment === 'heavy') {
        setTimeout(() => {
          triggerSound();
          // Trigger camera shake on heavy impact
          onHeavyImpact?.();
        }, duration * 0.8);
      } else {
        triggerSound();
      }
      
      setPosition({ x, y });
      
      setTimeout(() => {
        setIsDropping(false);
        onAnimationComplete?.();
      }, duration);
    }
  }, [y, x, physicsConfig.visualTreatment, onHeavyImpact]);


  // Handle match animation
  useEffect(() => {
    if (isMatched) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        onAnimationComplete?.();
      }, 300);
    }
  }, [isMatched]);

  // Get tile appearance based on physics profile
  const getTileStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      width: '50px',
      height: '50px',
      borderRadius: '8px',
      cursor: onClick ? 'pointer' : 'default',
      position: 'relative',
      willChange: 'transform',
    };

    // Physics-specific styling
    const physicsStyles: Record<string, React.CSSProperties> = {
      heavy: {

        // Tribe 11: Iron-bound wooden chest
        background: `linear-gradient(135deg, ${physicsConfig.colors.primary} 0%, ${physicsConfig.colors.secondary} 50%, ${adjustBrightness(physicsConfig.colors.primary, -20)} 100%)`,
        boxShadow: isSelected
          ? `0 0 25px ${physicsConfig.colors.accent}, inset 0 0 15px rgba(0,0,0,0.5)`
          : `0 8px 16px rgba(0,0,0,0.5), inset 0 2px 0 rgba(139,69,19,0.3), 0 0 0 2px ${physicsConfig.colors.secondary}`,
        border: isSelected ? `3px solid ${physicsConfig.colors.accent}` : `2px solid ${physicsConfig.colors.secondary}`,
        borderRadius: '4px', // Squared corners for heavy feel
      },
      buoyant: {
        // Tribe 5: Glowing feather-stone
        background: `radial-gradient(ellipse at 30% 30%, ${physicsConfig.colors.secondary} 0%, ${physicsConfig.colors.primary} 60%, ${adjustBrightness(physicsConfig.colors.primary, -10)} 100%)`,
        boxShadow: isSelected
          ? `0 0 30px ${physicsConfig.colors.glow}, inset 0 0 20px rgba(255,255,255,0.4)`
          : `0 4px 12px ${physicsConfig.colors.glow}, inset 0 0 10px rgba(255,255,255,0.2)`,
        border: isSelected ? `2px solid ${physicsConfig.colors.accent}` : `1px solid ${physicsConfig.colors.secondary}80`,
        borderRadius: '50% 20% 50% 20%', // Organic, flowing shape
      },
      synthesis: {
        // Tribe 12: Prismatic synthesis
        background: `linear-gradient(135deg, #C0C0C0 0%, #E0E0E0 50%, #C0C0C0 100%)`,
        boxShadow: isSelected
          ? `0 0 40px rgba(255,255,255,0.8), inset 0 0 20px rgba(255,255,255,0.5)`
          : `0 0 20px rgba(255,255,255,0.4), inset 0 0 10px rgba(255,255,255,0.3)`,
        border: `2px solid rgba(255,255,255,0.6)`,
        borderRadius: '12px',
      },
      standard: {
        // Default gem styling
        background: `linear-gradient(135deg, ${color} 0%, ${adjustBrightness(color, -20)} 100%)`,
        boxShadow: isSelected
          ? `0 0 20px ${color}, inset 0 0 10px rgba(255,255,255,0.5)`
          : `0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)`,
        border: isSelected ? `2px solid ${DESIGN_TOKENS.colors.resonanceGold}` : 'none',
        borderRadius: '8px',
      },
    };

    const visualStyle = physicsStyles[physicsConfig.visualTreatment] || physicsStyles.standard;

    return {
      ...baseStyles,
      ...visualStyle,
    };
  };


  // Get tribal pattern overlay
  const getTribalPattern = () => {
    if (tribeId === 0) {
      // Khoe-San: Rock texture
      return (
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='none'/%3E%3Cpath d='M2 2l16 16M18 2L2 18' stroke='%23000' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E")`,
          borderRadius: 'inherit',
        }} />
      );
    }
    
    if (tribeId === 9) {
      // isiNdebele: Geometric pattern
      return (
        <div style={{
          position: 'absolute',
          inset: '10%',
          border: `2px solid ${adjustBrightness(color, 30)}`,
          borderRadius: '4px',
        }} />
      );
    }
    
    if (tribeId === 12) {
      // Synthesis: Prismatic shimmer
      return (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
          animation: 'shimmer 2s infinite',
          borderRadius: 'inherit',
        }} />
      );
    }
    
    return null;
  };

  // Get physics indicator icon
  const getPhysicsIndicator = () => {
    if (physicsConfig.visualTreatment === 'heavy') {
      return (
        <div style={{
          position: 'absolute',
          bottom: '4px',
          right: '4px',
          fontSize: '12px',
          opacity: 0.7,
          color: physicsConfig.colors.accent,
        }}>
          ⚓
        </div>
      );
    }
    
    if (physicsConfig.visualTreatment === 'buoyant') {
      return (
        <div style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          fontSize: '12px',
          opacity: 0.7,
          color: physicsConfig.colors.accent,
        }}>
          🪶
        </div>
      );
    }
    
    return null;
  };

  // Render bubble particles for buoyant tiles
  const renderBubbles = () => {

    if (!physicsConfig.effects.bubbleParticles || bubbles.length === 0) return null;

    return (
      <AnimatePresence>
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            initial={{ opacity: 0, y: 40, scale: 0.5 }}
            animate={{ 
              opacity: [0, 0.8, 0.8, 0], 
              y: -60,
              x: [0, bubble.x / 10, -bubble.x / 10, 0],
              scale: [0.5, 1, 1.2, 1.5]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              ease: "easeOut",
            }}
            style={{
              position: 'absolute',
              left: `${bubble.x}%`,
              bottom: '10px',
              width: bubble.size,
              height: bubble.size,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, white, ${physicsConfig.colors.secondary})`,
              boxShadow: `0 0 4px ${physicsConfig.colors.glow}`,
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
    );
  };

  // Render visual trails for heavy tiles
  const renderTrails = () => {
    if (!physicsConfig.effects.visualTrails || trails.length === 0) return null;

    return trails.map((trail, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: trail.x,
          top: trail.y,
          width: '30px',
          height: '30px',
          borderRadius: '4px',
          background: physicsConfig.colors.primary,
          opacity: trail.opacity * (1 - index / trails.length),
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          filter: 'blur(2px)',
        }}
      />
    ));
  };


  // Utility: Adjust color brightness
  function adjustBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  }

  return (
    <motion.div
      ref={tileRef}
      layout
      initial={false}
      animate={{
        x: position.x * 55,
        y: position.y * 55,
        scale: isMatched ? 0 : 1,
        rotate: isDropping && physicsConfig.visualTreatment === 'heavy' ? [0, -2, 2, 0] : 0,
      }}
      transition={getMotionTransition()}
      className={`game-tile ${isDropping ? 'dropping' : ''} ${isAnimating ? 'matching' : ''} ${isFloating ? 'floating' : ''}`}
      style={getTileStyles()}
      onClick={onClick}
      data-tile-id={id}
      data-tribe={tribeId}
      data-mass={physics.mass}
      data-buoyancy={physics.buoyancy}
      data-physics={physicsConfig.visualTreatment}
    >
      {/* Tribal Pattern Overlay */}
      {getTribalPattern()}
      
      {/* Gem Facet Effect - only for standard gems */}
      {type === 'gem' && physicsConfig.visualTreatment === 'standard' && (
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '15%',
          width: '30%',
          height: '30%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
          borderRadius: '4px',
        }} />
      )}

      {/* Heavy tile: Metallic sheen */}
      {physicsConfig.visualTreatment === 'heavy' && (
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '40%',
          height: '20%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
          borderRadius: '2px',
        }} />
      )}

      {/* Buoyant tile: Inner glow */}
      {physicsConfig.visualTreatment === 'buoyant' && (
        <div style={{
          position: 'absolute',
          inset: '20%',
          background: `radial-gradient(circle, ${physicsConfig.colors.secondary}60 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: 'breathe 3s ease-in-out infinite',
        }} />
      )}
      
      {/* Physics Indicator */}
      {getPhysicsIndicator()}

      {/* Bubble Particles for Buoyant Tiles */}
      {renderBubbles()}

      {/* Visual Trails for Heavy Tiles */}
      {renderTrails()}
      
      {/* Selection Glow */}
      {isSelected && (
        <motion.div 
          layoutId="selectionGlow"
          style={{
            position: 'absolute',
            inset: physicsConfig.visualTreatment === 'heavy' ? '-6px' : '-4px',
            borderRadius: physicsConfig.visualTreatment === 'heavy' ? '6px' : '12px',
            border: `2px solid ${physicsConfig.visualTreatment === 'heavy' ? physicsConfig.colors.accent : DESIGN_TOKENS.colors.resonanceGold}`,
            pointerEvents: 'none',
          }}
          animate={{
            boxShadow: [
              `0 0 10px ${physicsConfig.colors.glow}`,
              `0 0 20px ${physicsConfig.colors.glow}`,
              `0 0 10px ${physicsConfig.colors.glow}`,
            ],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}
      
      {/* Match Animation Overlay */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: physicsConfig.visualTreatment === 'heavy'
                ? `radial-gradient(circle, ${physicsConfig.colors.accent}80 0%, transparent 70%)`
                : physicsConfig.visualTreatment === 'buoyant'
                ? `radial-gradient(circle, ${physicsConfig.colors.secondary}80 0%, transparent 70%)`
                : 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
              borderRadius: 'inherit',
            }}
          />
        )}
      </AnimatePresence>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
        
        .dropping {
          z-index: 10;
        }
        
        .matching {
          z-index: 20;
        }

        .floating {
          animation: ${physicsConfig.effects.floatAnimation ? 'breathe 3s ease-in-out infinite' : 'none'};
        }
      `}</style>
    </motion.div>
  );

}

export default Tile;
