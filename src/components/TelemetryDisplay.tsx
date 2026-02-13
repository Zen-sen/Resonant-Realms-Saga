import React from 'react';
import { TelemetryDataPoint } from '../physics/telemetry';

interface TelemetryDisplayProps {
    telemetry: TelemetryDataPoint | null;
    mintUnlocked: boolean;
    failedAttempts: number;
    adversaryBuffer: number;
}

/**
 * @component TelemetryDisplay
 * Real-time display of experiment metrics with "Heartbeat" waveform visualization.
 * 
 * Shows:
 * - Current weight (N)
 * - Variance from baseline (color-coded)
 * - Lift percentage with progress bar
 * - E-Field intensity "Heartbeat"
 * - Adversary Buffer / Failed Lessons
 */
export function TelemetryDisplay({
    telemetry,
    mintUnlocked,
    failedAttempts,
    adversaryBuffer
}: TelemetryDisplayProps) {

    if (!telemetry) {
        return (
            <div className="telemetry-display telemetry-idle">
                <p className="status-text">⚡ AWAITING OBSERVER INPUT</p>
                <p className="subtitle">Adjust voltage to begin experiment</p>
            </div>
        );
    }

    // Calculate lift percentage
    const baselineWeight = telemetry.weight + telemetry.variance;
    const liftPercent = (telemetry.variance / baselineWeight) * 100;
    const eFieldKv = (telemetry.fieldParams.electricFieldIntensity * 0.05) / 1000;

    // Determine color based on lift progress
    const getProgressColor = () => {
        if (liftPercent >= 30) return '#10b981'; // Green - Ascension
        if (liftPercent >= 20) return '#f59e0b'; // Amber - Close
        if (liftPercent >= 10) return '#06b6d4'; // Cyan - Promising
        return '#9ca3af'; // Gray - Baseline
    };

    return (
        <div className="telemetry-display">
            {/* Header */}
            <div className="telemetry-header">
                <h3 className="telemetry-title">TELEMETRY STREAM</h3>
                {mintUnlocked && (
                    <span className="unlock-badge">🔓 ASCENSION KEY</span>
                )}
            </div>

            {/* Main Metrics Grid */}
            <div className="metrics-grid">
                {/* Weight Reading */}
                <div className="metric-card">
                    <div className="metric-label">WEIGHT</div>
                    <div className="metric-value">
                        {telemetry.weight.toFixed(4)}
                        <span className="metric-unit">N</span>
                    </div>
                </div>

                {/* Variance */}
                <div className="metric-card">
                    <div className="metric-label">VARIANCE</div>
                    <div
                        className="metric-value"
                        style={{ color: telemetry.variance > 0 ? '#10b981' : '#ef4444' }}
                    >
                        {telemetry.variance > 0 ? '+' : ''}
                        {telemetry.variance.toExponential(2)}
                        <span className="metric-unit">N</span>
                    </div>
                </div>

                {/* E-Field */}
                <div className="metric-card">
                    <div className="metric-label">E-FIELD</div>
                    <div className="metric-value">
                        {eFieldKv.toFixed(1)}
                        <span className="metric-unit">kV</span>
                    </div>
                </div>

                {/* Lift % */}
                <div className="metric-card lift-metric">
                    <div className="metric-label">LIFT %</div>
                    <div
                        className="metric-value"
                        style={{ color: getProgressColor() }}
                    >
                        {liftPercent.toFixed(2)}
                        <span className="metric-unit">%</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="lift-progress">
                <div className="progress-labels">
                    <span>Foundation</span>
                    <span className="threshold-marker">30% ⟶</span>
                    <span>Ascension</span>
                </div>
                <div className="progress-track">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${Math.min(liftPercent, 100)}%`,
                            backgroundColor: getProgressColor()
                        }}
                    />
                    {/* 30% threshold marker */}
                    <div className="threshold-line" style={{ left: '30%' }} />
                </div>
                <div className="progress-value">{liftPercent.toFixed(1)}%</div>
            </div>

            {/* Adversary Buffer / Lessons */}
            <div className="adversary-section">
                <div className="adversary-label">
                    MIRROR-ADVERSARY BUFFER
                </div>
                <div className="adversary-stats">
                    <span className="buffer-value">{adversaryBuffer} points</span>
                    <span className="lessons-encoded">
                        📚 {failedAttempts} Lessons Encoded
                    </span>
                </div>
                <div className="adversary-hint">
                    "Every failure teaches where boundaries lie"
                </div>
            </div>

            {/* Heartbeat Visualization */}
            <div className="heartbeat-wrapper">
                <div className="heartbeat-label">E-FIELD RESONANCE</div>
                <svg className="heartbeat-svg" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <path
                        d={generateHeartbeatPath(eFieldKv, liftPercent)}
                        stroke={getProgressColor()}
                        strokeWidth="2"
                        fill="none"
                        className="heartbeat-path"
                    />
                </svg>
            </div>
        </div>
    );
}

/**
 * Generates SVG path for "Heartbeat" waveform based on E-field and lift.
 * Phase 6: Added "Viscosity" Jitter at high voltages.
 */
function generateHeartbeatPath(eFieldKv: number, liftPercent: number): string {
    const amplitude = Math.min(eFieldKv / 60 * 25, 25); // Scale to max 25px
    const frequency = 1 + (liftPercent / 10); // More lift = faster oscillation

    // Phase 6: Viscosity Jitter (Breakthrough Instability)
    const jitter = eFieldKv > 35 ? (Math.random() - 0.5) * (eFieldKv - 35) * 0.2 : 0;

    let path = 'M 0 30';
    for (let x = 0; x <= 200; x += 2) {
        // Apply jitter to each node for a "shaking" effect
        const localJitter = jitter * Math.sin(x + Date.now() / 100);
        const y = 30 + (amplitude + localJitter) * Math.sin(x / 10 * frequency);
        path += ` L ${x} ${y}`;
    }

    return path;
}
