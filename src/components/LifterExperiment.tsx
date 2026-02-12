import React, { useState } from 'react';
import { useExperiment } from '../hooks/useExperiment';
import { TelemetryDisplay } from './TelemetryDisplay';
import { MetadataGenerator } from '../logic/metadata-generator';
import { ethers } from 'ethers';
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
    const [experimentState, controls] = useExperiment(true); // Vacuum mode ON for hardest test
    const [isMinting, setIsMinting] = useState(false);
    const [showAscensionAnimation, setShowAscensionAnimation] = useState(false);

    // Phase 6 Audio Layer
    useExperimentAudio(experimentState.voltage, experimentState.isRunning);

    const {
        voltage,
        telemetry,
        isRunning,
        mintUnlocked,
        failedAttempts,
        adversaryBuffer,
        history
    } = experimentState;

    const {
        setVoltage,
        startExperiment,
        resetExperiment,
        recordFailedAttempt
    } = controls;

    // Handle voltage slider change
    const handleVoltageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVoltage = parseInt(event.target.value);
        setVoltage(newVoltage);

        // Trigger ascension animation if crossing 30% for first time
        if (telemetry && !showAscensionAnimation) {
            const liftPercent = (telemetry.variance / (telemetry.weight + telemetry.variance)) * 100;
            if (liftPercent >= 30) {
                setShowAscensionAnimation(true);
                playBreakthroughSound();
            }
        }
    };

    // Start experiment flow
    const handleStart = () => {
        startExperiment();
    };

    // Reset and try again
    const handleReset = () => {
        if (isRunning && telemetry) {
            const liftPercent = (telemetry.variance / (telemetry.weight + telemetry.variance)) * 100;
            if (liftPercent < 30) {
                recordFailedAttempt(); // Encode the lesson
            }
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
            const DIAMOND_ADDRESS = "0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f";

            // Step 1: Record experiment
            const antigravityFacet = new ethers.Contract(
                DIAMOND_ADDRESS,
                ["function recordExperiment(uint256 _liftPercent, uint256 _peakVoltage, bytes32 _telemetryHash, string calldata _metadataURI) external"],
                signer
            );

            const liftPercentBp = Math.floor(metadata.properties.max_lift_percentage * 100);
            const peakVoltageCentiKv = Math.floor(metadata.properties.peak_voltage * 100);

            console.log("📡 Recording experiment...");
            const recordTx = await antigravityFacet.recordExperiment(
                liftPercentBp,
                peakVoltageCentiKv,
                metadata.properties.telemetry_hash,
                MetadataGenerator.toDataURI(metadata)
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

    return (
        <div className="lifter-experiment">
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
                    </div>
                </div>
            )}

            {/* Main Console */}
            <div className={`experiment-console ${showAscensionAnimation ? 'breakthrough-active' : ''}`}>
                <div className="breakthrough-glow" />

                {/* Ion Wind Particles */}
                {isRunning && voltage > 10000 && (
                    <div className="ion-wind-container ion-wind-active">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="particle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    '--duration': `${0.5 + Math.random() * 1}s`,
                                    '--delay': `${Math.random() * 2}s`,
                                    '--drift': `${(Math.random() - 0.5) * 50}px`
                                } as any}
                            />
                        ))}
                    </div>
                )}

                <div className="console-header">
                    <h2 className="console-title">GENESIS EXPERIMENT</h2>
                    <div className="console-subtitle">The Observer's Ritual</div>
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
    const gainNodeRef = React.useRef<GainNode | null>(null);

    React.useEffect(() => {
        if (isRunning && !audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            oscillatorRef.current = audioContextRef.current.createOscillator();
            gainNodeRef.current = audioContextRef.current.createGain();

            oscillatorRef.current.type = 'sawtooth';
            oscillatorRef.current.frequency.setValueAtTime(60, audioContextRef.current.currentTime);

            gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);

            oscillatorRef.current.connect(gainNodeRef.current);
            gainNodeRef.current.connect(audioContextRef.current.destination);

            oscillatorRef.current.start();
        }

        if (isRunning && audioContextRef.current && oscillatorRef.current && gainNodeRef.current) {
            // Increase pitch slightly with voltage (60Hz to 120Hz)
            const freq = 60 + (voltage / 60000) * 60;
            oscillatorRef.current.frequency.setTargetAtTime(freq, audioContextRef.current.currentTime, 0.1);

            // Increase volume with voltage
            const volume = (voltage / 60000) * 0.1;
            gainNodeRef.current.gain.setTargetAtTime(volume, audioContextRef.current.currentTime, 0.1);
        }

        if (!isRunning && audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
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
