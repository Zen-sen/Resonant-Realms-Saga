import React, { useState } from 'react';
import { useExperiment } from '../hooks/useExperiment';
import { TelemetryDisplay } from './TelemetryDisplay';
import { MetadataGenerator } from '../logic/metadata-generator';
import { ethers } from 'ethers';
import { playFoundationSound } from '../logic/universal/sound-of-the-root';
import '../styles/experiment.css';

interface LifterExperimentProps {
    provider?: ethers.BrowserProvider;
    onMintSuccess?: () => void;
}

/**
 * @component LifterExperiment
 * Main experiment interface - The Observer's Console.
 * 
 * Features:
 * - Heavy, tactile voltage slider (0-60kV)
 * - Real-time telemetry display
 * - Ascension animation at 30% threshold
 * - Mint transaction integration
 */
export function LifterExperiment({ provider, onMintSuccess }: LifterExperimentProps) {
    const [experimentState, controls] = useExperiment(false);
    const [isMinting, setIsMinting] = useState(false);
    const [showAscensionAnimation, setShowAscensionAnimation] = useState(false);
    const [selectedSageId, setSelectedSageId] = useState<number | null>(null);

    // Mock Sages for the Selector
    const MOCK_SAGES = [
        { id: 1, name: "Scout 1", genes: 0n },
        { id: 5, name: "Elder Sage", genes: 1n }, // Bit 0: 1 (Foundation)
        { id: 13, name: "Unity Drone", genes: 0n }
    ];

    const {
        voltage,
        telemetry,
        isRunning,
        mintUnlocked,
        failedAttempts,
        adversaryBuffer,
        history,
        vacuumMode
    } = experimentState;

    const liftPercent = telemetry ? (telemetry.variance / (telemetry.weight + telemetry.variance)) * 100 : 0;

    // Phase 8: Deep Haptic Sync
    React.useEffect(() => {
        if (isRunning && voltage > 10000 && 'vibrate' in navigator) {
            // Breakthrough Pulse at 35kV (The Mirror crossing)
            if (voltage >= 34000 && voltage <= 36000) {
                navigator.vibrate([100, 30, 100]); // Strong double pulse
                return;
            }

            // High Voltage Resonance (shaking effect)
            const intensity = Math.floor((voltage / 60000) * 20);
            if (intensity > 5) {
                // Higher voltage = more complex vibration patterns
                if (voltage > 45000) {
                    navigator.vibrate([intensity, 10, intensity / 2]);
                } else {
                    navigator.vibrate(intensity);
                }
            }
        }
    }, [voltage, isRunning]);

    const {
        setVoltage,
        startExperiment,
        resetExperiment,
        recordFailedAttempt,
        setVacuumMode
    } = controls;

    // Handle voltage slider change
    const handleVoltageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVoltage = parseInt(event.target.value);
        setVoltage(newVoltage);

        // Trigger ascension animation if crossing 30% for first time
        if (liftPercent >= 30 && !showAscensionAnimation) {
            setShowAscensionAnimation(true);
            playBreakthroughSound();
        }
    };

    // Handle Sage Selection
    const handleSageSelect = (id: number) => {
        setSelectedSageId(id);
        const sage = MOCK_SAGES.find(s => s.id === id);
        if (sage && (sage.genes & 1n) === 1n) {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            playFoundationSound(ctx);
        }
    };

    // Start experiment flow
    const handleStart = () => {
        startExperiment();
    };

    // Reset and try again
    const handleReset = () => {
        if (isRunning && liftPercent < 30) {
            recordFailedAttempt(); // Encode the lesson
        }
        resetExperiment();
        setShowAscensionAnimation(false);
    };

    // Mint NFT with experiment data
    const handleMint = async () => {
        if (!provider || !mintUnlocked || history.length === 0) return;

        setIsMinting(true);
        try {
            // Generate metadata (The Vessel)
            const metadata = MetadataGenerator.generate(
                history,
                0.5, // 500g test mass
                adversaryBuffer
            );

            const signer = await provider.getSigner();
            const DIAMOND_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

            // Step 1: Record experiment
            const antigravityFacet = new ethers.Contract(
                DIAMOND_ADDRESS,
                ["function recordExperiment(uint256 _liftPercent, uint256 _peakVoltage, bytes32 _telemetryHash, string calldata _metadataURI, uint256 _adversaryBuffer) external"],
                signer
            );

            const liftPercentBp = Math.floor(metadata.properties.max_lift_percentage * 100);
            const peakVoltageCentiKv = Math.floor(metadata.properties.peak_voltage * 100);

            console.log("📡 Recording experiment with buffer:", adversaryBuffer);
            const recordTx = await antigravityFacet.recordExperiment(
                liftPercentBp,
                peakVoltageCentiKv,
                metadata.properties.telemetry_hash,
                MetadataGenerator.toDataURI(metadata),
                adversaryBuffer
            );
            await recordTx.wait();

            console.log("✅ Experiment recorded. Ascending to Tribe 0...");

            // Step 2: Join Tribe 0 (mints ǃKaggen eligibility)
            const heritageFacet = new ethers.Contract(
                DIAMOND_ADDRESS,
                ["function joinTribe(uint256 _tribeId) external"],
                signer
            );

            const joinTx = await heritageFacet.joinTribe(0);
            await joinTx.wait();

            console.log("🎉 ǃKAGGEN AWAKENED!");
            onMintSuccess?.();

        } catch (error: any) {
            console.error("❌ Mint failed:", error.message);
            alert("Transaction failed: " + error.message);
        } finally {
            setIsMinting(false);
        }
    };

    // Phase 6 & 3 Audio Layer
    useExperimentAudio(voltage, isRunning);

    return (
        <div className={`lifter-experiment ${liftPercent >= 35 ? 'breakthrough-whiteout' : ''}`}>
            {/* Ascension Animation Overlay */}
            {showAscensionAnimation && (
                <div className="ascension-overlay">
                    <div className="mantis-emergence">
                        <div className="glow-ring" />
                        <div className="ascension-text">
                            🔓 ASCENSION KEY
                        </div>
                        <div className="mantis-icon">ǃKAGGEN</div>
                        <div className="threshold-text">30% THRESHOLD CROSSED</div>
                        {adversaryBuffer > 0 && (
                            <div className="mercy-text">Ubuntu Mercy active: +{(adversaryBuffer * 0.1).toFixed(1)}% Lift</div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Console */}
            <div className={`experiment-console ${showAscensionAnimation ? 'breakthrough-active' : ''} ${voltage > 45000 ? 'at-high-voltage' : ''}`}>
                <div className="breakthrough-glow" />

                {/* Ion Wind Particles (Dynamic Corona Discharge) */}
                {isRunning && voltage > 10000 && (
                    <div className="ion-wind-container ion-wind-active">
                        {[...Array(Math.min(20 + Math.floor(voltage / 2000), 50))].map((_, i) => (
                            <div
                                key={i}
                                className="particle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    '--duration': `${0.3 + Math.random() * 1}s`,
                                    '--delay': `${Math.random() * 2}s`,
                                    '--drift': `${(Math.random() - 0.5) * 80}px`
                                } as any}
                            />
                        ))}
                    </div>
                )}

                <div className="console-header">
                    <h2 className="console-title">GENESIS EXPERIMENT</h2>
                    <div className="console-subtitle">The Observer's Ritual</div>

                    {/* Phase 1: Vacuum Toggle */}
                    <div className="void-mode-toggle">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={vacuumMode}
                                onChange={(e) => setVacuumMode(e.target.checked)}
                                disabled={isRunning}
                            />
                            <span className="slider-toggle round"></span>
                        </label>
                        <span className="toggle-label">{vacuumMode ? 'VOID MODE (VACUUM)' : 'ATMOS MODE'}</span>
                    </div>
                </div>

                {/* Sage Selector Integration */}
                <div className="sage-selector-panel" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '0.5rem', fontWeight: 'bold' }}>SELECT ACTIVE SAGE:</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {MOCK_SAGES.map(sage => (
                            <button
                                key={sage.id}
                                onClick={() => handleSageSelect(sage.id)}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.75rem',
                                    background: selectedSageId === sage.id ? '#06b6d4' : 'transparent',
                                    color: selectedSageId === sage.id ? '#000' : '#06b6d4',
                                    border: '1px solid #06b6d4',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {sage.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Voltage Control Section */}
                <div className="voltage-control-section">
                    <div className="voltage-label-row">
                        <span className="control-label">VOLTAGE</span>
                        <span className="voltage-readout">
                            {(voltage / 1000).toFixed(1)} kV
                        </span>
                    </div>

                    {/* Heavy, Tactile Slider */}
                    <div className="voltage-slider-container">
                        <input
                            type="range"
                            min="0"
                            max="60000"
                            step="1000"
                            value={voltage}
                            onChange={handleVoltageChange}
                            disabled={!isRunning}
                            className="voltage-slider"
                        />
                        <div className="slider-markers">
                            <span>0</span>
                            <span className="marker-35kV">35kV ⟶ Integration</span>
                            <span>60</span>
                        </div>
                    </div>

                    {/* Electric Arc Visualization */}
                    <div className="electric-arc" style={{ opacity: voltage / 60000 }}>
                        <svg viewBox="0 0 100 20" className="arc-svg">
                            <path
                                d={generateArcPath(voltage)}
                                stroke="#06b6d4"
                                strokeWidth="2"
                                fill="none"
                                className="arc-path"
                            />
                        </svg>
                    </div>
                </div>

                {/* Telemetry Display */}
                <TelemetryDisplay
                    telemetry={telemetry}
                    mintUnlocked={mintUnlocked}
                    failedAttempts={failedAttempts}
                    adversaryBuffer={adversaryBuffer}
                />

                {/* Control Buttons */}
                <div className="control-buttons">
                    {!isRunning ? (
                        <button
                            className="btn-primary btn-start"
                            onClick={handleStart}
                        >
                            ⚡ INITIATE EXPERIMENT
                        </button>
                    ) : (
                        <button
                            className="btn-secondary btn-reset"
                            onClick={handleReset}
                        >
                            ⟲ RESET
                        </button>
                    )}

                    {mintUnlocked && (
                        <button
                            className="btn-mint"
                            onClick={handleMint}
                            disabled={isMinting}
                        >
                            {isMinting ? '⏳ MINTING...' : '🐰 MINT ǃKAGGEN'}
                        </button>
                    )}
                </div>

                {/* Footer Info */}
                <div className="console-footer">
                    <div className="footer-stat">
                        <span className="stat-label">Vacuum Mode:</span>
                        <span className="stat-value">Active</span>
                    </div>
                    <div className="footer-stat">
                        <span className="stat-label">Test Mass:</span>
                        <span className="stat-value">500g</span>
                    </div>
                    <div className="footer-stat">
                        <span className="stat-label">Threshold:</span>
                        <span className="stat-value">30%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Generates SVG path for electric arc based on voltage.
 */
function generateArcPath(voltage: number): string {
    const intensity = voltage / 60000;
    let path = 'M 0 10';

    for (let x = 0; x <= 100; x += 5) {
        const randomness = intensity * (Math.random() - 0.5) * 8;
        const y = 10 + randomness;
        path += ` L ${x} ${y}`;
    }

    return path;
}

/**
 * Plays 60Hz hum that increases with voltage using Web Audio API.
 */
function useExperimentAudio(voltage: number, isRunning: boolean) {
    const audioContextRef = React.useRef<AudioContext | null>(null);
    const oscillatorRef = React.useRef<OscillatorNode | null>(null);
    const harmonicOscRef = React.useRef<OscillatorNode | null>(null);
    const gainNodeRef = React.useRef<GainNode | null>(null);

    React.useEffect(() => {
        const stopAudio = async () => {
            // Use the Safe-Close Pattern to avoid the InvalidStateError
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                try {
                    await audioContextRef.current.close();
                    audioContextRef.current = null; // Reset the vessel
                } catch (err) {
                    // The error is silenced; the lesson is already encoded.
                }
            }
        };

        if (isRunning && !audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            oscillatorRef.current = audioContextRef.current.createOscillator();
            harmonicOscRef.current = audioContextRef.current.createOscillator();
            gainNodeRef.current = audioContextRef.current.createGain();

            oscillatorRef.current.type = 'sawtooth';
            oscillatorRef.current.frequency.setValueAtTime(60, audioContextRef.current.currentTime);

            // Phase 3: Higher Harmonic Oscillator
            harmonicOscRef.current.type = 'sine';
            harmonicOscRef.current.frequency.setValueAtTime(120, audioContextRef.current.currentTime);

            gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);

            oscillatorRef.current.connect(gainNodeRef.current);
            harmonicOscRef.current.connect(gainNodeRef.current);
            gainNodeRef.current.connect(audioContextRef.current.destination);

            oscillatorRef.current.start();
            harmonicOscRef.current.start();
        }

        if (isRunning && audioContextRef.current && oscillatorRef.current && harmonicOscRef.current && gainNodeRef.current) {
            // Increase pitch slightly with voltage (60Hz to 120Hz)
            const freq = 60 + (voltage / 60000) * 60;
            oscillatorRef.current.frequency.setTargetAtTime(freq, audioContextRef.current.currentTime, 0.1);

            // Phase 3: Secondary Harmonic kicks in at 35kV (Integration Layer)
            if (voltage > 35000) {
                const harmonicFreq = 120 + ((voltage - 35000) / 25000) * 240; // 120Hz to 360Hz
                harmonicOscRef.current.frequency.setTargetAtTime(harmonicFreq, audioContextRef.current.currentTime, 0.1);
            } else {
                harmonicOscRef.current.frequency.setTargetAtTime(120, audioContextRef.current.currentTime, 0.1);
            }

            // Increase volume with voltage
            const volume = (voltage / 60000) * 0.1;
            gainNodeRef.current.gain.setTargetAtTime(volume, audioContextRef.current.currentTime, 0.1);
        }

        if (!isRunning && audioContextRef.current) {
            stopAudio();
        }

        return () => {
            stopAudio();
        };
    }, [isRunning, voltage]);
}

function playBreakthroughSound() {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.5); // A6

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 1);
    } catch (e) {
        console.warn("Audio not supported or blocked");
    }
    console.log("🎵 Breakthrough chime at 30% threshold");
}
