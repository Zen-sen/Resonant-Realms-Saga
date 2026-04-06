import { useState, useCallback } from 'react';
import { useWallet } from '../hooks/useWallet';
import { REALMS, type RealmType } from '../config/contracts';

interface RealmTraversalProps {
  currentRealm: RealmType;
  onTraverse: (realm: RealmType) => void;
}

const realmDescriptions: Record<RealmType, { title: string; description: string; color: string }> = {
  [REALMS.FOUNDATION]: {
    title: 'THE FIRST DREAM',
    description: 'Ancient wisdom guides your path. The Khoe-San legacy awaits.',
    color: '#CC7722'
  },
  [REALMS.SYNTHESIS]: {
    title: 'THE BALANCED BRIDGE',
    description: 'All colors converge. The bridge between worlds.',
    color: '#FFFFFF'
  },
  [REALMS.GENESIS]: {
    title: 'GENESIS EXPERIMENT',
    description: 'Achieve ≥30% mass reduction to unlock ǃKaggen (Tribe 0)',
    color: '#10b981'
  }
};

export function RealmTraversal({ currentRealm, onTraverse }: RealmTraversalProps) {
  const { account, isConnecting } = useWallet();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTraverse = useCallback((targetRealm: RealmType) => {
    if (targetRealm === currentRealm || isAnimating || !account) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      onTraverse(targetRealm);
      setIsAnimating(false);
    }, 500);
  }, [currentRealm, onTraverse, isAnimating, account]);

  return (
    <div className="realm-traversal-container">
      <div className="realm-portals">
        {Object.entries(realmDescriptions).map(([realm, info]) => (
          <button
            key={realm}
            onClick={() => handleTraverse(realm as RealmType)}
            disabled={!account || isConnecting || isAnimating || currentRealm === realm}
            className={`realm-portal ${currentRealm === realm ? 'active' : ''} ${isAnimating ? 'animating' : ''}`}
            style={{
              '--realm-color': info.color,
            } as React.CSSProperties}
          >
            <span className="portal-title">{info.title}</span>
            <span className="portal-desc">{info.description}</span>
            {currentRealm === realm && <span className="current-indicator">◉</span>}
          </button>
        ))}
      </div>

      <style>{`
        .realm-traversal-container {
          padding: 1rem;
        }

        .realm-portals {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .realm-portal {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 1rem 1.5rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--realm-color, #666);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .realm-portal:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.05);
          transform: translateX(4px);
          box-shadow: 0 0 20px var(--realm-color, transparent);
        }

        .realm-portal:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .realm-portal.active {
          border-color: var(--realm-color);
          box-shadow: 0 0 15px var(--realm-color), inset 0 0 30px rgba(255, 255, 255, 0.05);
        }

        .realm-portal.animating {
          animation: realmPulse 0.5s ease-in-out;
        }

        @keyframes realmPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.98); }
        }

        .portal-title {
          font-size: 0.9rem;
          font-weight: bold;
          color: var(--realm-color);
          letter-spacing: 0.1em;
          margin-bottom: 0.25rem;
        }

        .portal-desc {
          font-size: 0.7rem;
          color: #9ca3af;
          line-height: 1.4;
        }

        .current-indicator {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--realm-color);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
