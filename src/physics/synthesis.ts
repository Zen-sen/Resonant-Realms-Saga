
/**
 * @fileoverview The Synthesis Check
 * Integration Layer: Merging physical experimentation with the game world's conceptual framework.
 */

import { TelemetryDataPoint } from './telemetry';
import { SafetyStatus } from './safety';

export enum IntegrationLayerType {
    PHYSICAL_EXPERIMENT = "MARS_DRIVE",
    SIMULATED_FRAMEWORK = "JUPITER_SCALE"
}

export interface SynthesisReport {
    timestamp: number;
    layer: IntegrationLayerType;
    status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
    message: string;
}

export class SynthesisCheck {
    private adversaryBuffer = 0; // Accumulates "Mirror-Adversary" resonance from failures/noise

    constructor(private layer: IntegrationLayerType) { }

    /**
     * Determines if the current "tech" serves as a viable integration layer.
     * @param telemetry Latest telemetry data
     * @param safety Current safety status
     * @param theoreticalIonThrust Theoretical EHD thrust (Newtons) to subtract for vacuum check
     */
    public checkIntegration(
        telemetry: TelemetryDataPoint | null,
        safety: SafetyStatus,
        theoreticalIonThrust: number = 0
    ): SynthesisReport {
        const timestamp = Date.now();

        if (!safety.grounded) {
            this.adversaryBuffer += 5; // Major learning event
            return {
                timestamp,
                layer: this.layer,
                status: 'CRITICAL',
                message: `Synthesis failed: Grounding Fault. Adversary Buffer: ${this.adversaryBuffer}`
            };
        }

        if (!telemetry) {
            return {
                timestamp,
                layer: this.layer,
                status: 'DEGRADED',
                message: "Awaiting telemetry stream..."
            };
        }

        // Vacuum Chamber Logic: Isolate "Residual" (Non-Newtonian) Thrust
        // Variance (measured lift) - Ion Wind (EHD) = Residual
        const residualThrust = telemetry.variance - theoreticalIonThrust;

        // Calculate percentages
        // Variance relative to standard weight
        // Note: positive variance = weight loss
        const totalLiftRatio = telemetry.variance / (telemetry.weight + telemetry.variance);
        const residualRatio = residualThrust / (telemetry.weight + telemetry.variance);

        let msg = `Nominal. Buffer: ${this.adversaryBuffer}`;
        let status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL' = 'OPTIMAL';

        if (this.layer === IntegrationLayerType.PHYSICAL_EXPERIMENT) {
            if (residualRatio > 0.01) {
                msg = `ANOMALY: Residual Thrust ${residualThrust.toFixed(4)}N detected (Vacuum-Proof).`;
                this.adversaryBuffer += 10; // Success feeds the adversary too
            } else if (Math.abs(residualThrust) < 0.001 && telemetry.variance > 0.01) {
                msg = `Standard EHD: Lift confirms Ion Wind model.`;
            }
        } else {
            // Game Logic: 
            // If total lift > 30%, we unlock minting.
            if (totalLiftRatio > 0.30) {
                msg = "ASCENSION PROTOCOL: >30% Gravitational Negation. Minting Unlocked.";
            } else if (telemetry.variance < 0) {
                // Weight GAIN? Gravity anomaly?
                this.adversaryBuffer += 1;
                msg = `Gravity Well deepening. Adversary Buffer: ${this.adversaryBuffer}`;
            }
        }

        return {
            timestamp,
            layer: this.layer,
            status,
            message: msg
        };
    }
}
