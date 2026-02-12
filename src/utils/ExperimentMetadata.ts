import { TelemetryDataPoint } from '../physics/telemetry';
import { ethers } from 'ethers';

/**
 * @fileoverview ExperimentNFT Metadata Generator
 * Creates OpenSea-compatible NFT metadata from antigravity experiment telemetry.
 * 
 * NFT Schema (Record of Truth):
 * - base_weight: Initial test mass (grams)
 * - peak_voltage: Maximum voltage reached (kV)
 * - max_lift_percentage: Peak mass reduction (%)
 * - telemetry_hash: Keccak256 hash of full data
 */

export interface ExperimentMetadata {
    name: string;
    description: string;
    image: string; // IPFS/Arweave URI or data:image/svg+xml base64
    attributes: Array<{
        trait_type: string;
        value: string | number;
        display_type?: string;
    }>;
    properties: {
        base_weight: number;      // grams
        peak_voltage: number;     // kV
        max_lift_percentage: number;  // percentage
        telemetry_hash: string;   // 0x...
        threshold_voltage: number; // kV where 30% first achieved
        adversary_buffer: number;
    };
    telemetry: TelemetryDataPoint[]; // Full experiment history
}

export class ExperimentNFTGenerator {

    /**
     * Generates complete NFT metadata from experiment telemetry.
     * @param telemetryHistory Full history of experiment data points
     * @param baseMass Test mass in kg
     * @returns Complete OpenSea-compatible metadata object
     */
    public static generateMetadata(
        telemetryHistory: TelemetryDataPoint[],
        baseMass: number,
        adversaryBuffer: number = 0
    ): ExperimentMetadata {
        // Calculate statistics
        const maxVariance = Math.max(...telemetryHistory.map(d => d.variance));
        const baseWeight = baseMass * 9.81; // Convert to Newtons
        const maxLiftPercent = (maxVariance / baseWeight) * 100;

        // Find peak voltage (where max lift occurred)
        const peakDataPoint = telemetryHistory.reduce((max, curr) =>
            curr.variance > max.variance ? curr : max
        );
        const peakVoltage = peakDataPoint.fieldParams.electricFieldIntensity * 0.05 / 1000; // E-field to kV

        // Find threshold voltage (first ≥30%)
        const thresholdPoint = telemetryHistory.find(d =>
            (d.variance / baseWeight) * 100 >= 30
        );
        const thresholdVoltage = thresholdPoint
            ? thresholdPoint.fieldParams.electricFieldIntensity * 0.05 / 1000
            : 0;

        // Generate telemetry hash (for on-chain verification)
        const telemetryJSON = JSON.stringify(telemetryHistory);
        const telemetryHash = ethers.keccak256(ethers.toUtf8Bytes(telemetryJSON));

        return {
            name: "ǃKaggen Genesis Experiment",
            description: `Verified antigravity experiment achieving ${maxLiftPercent.toFixed(2)}% mass reduction at ${peakVoltage.toFixed(1)}kV. This NFT serves as a Record of Truth for the observer's journey through the Integration Layer, proving mastery of the Foundation-Synthesis bridge. The Mantis awakens.`,
            image: this.generateSVG(maxLiftPercent, peakVoltage, thresholdVoltage),
            attributes: [
                {
                    trait_type: "Max Lift %",
                    value: parseFloat(maxLiftPercent.toFixed(2)),
                    display_type: "number"
                },
                {
                    trait_type: "Peak Voltage (kV)",
                    value: parseFloat(peakVoltage.toFixed(1)),
                    display_type: "number"
                },
                {
                    trait_type: "Threshold Voltage (kV)",
                    value: parseFloat(thresholdVoltage.toFixed(1)),
                    display_type: "number"
                },
                {
                    trait_type: "Adversary Buffer",
                    value: adversaryBuffer,
                    display_type: "number"
                },
                {
                    trait_type: "Test Mass (g)",
                    value: baseMass * 1000,
                    display_type: "number"
                },
                {
                    trait_type: "Ascension Status",
                    value: maxLiftPercent >= 30 ? "Unlocked" : "Sealed"
                },
                {
                    trait_type: "Tribe Eligibility",
                    value: "Khoe-San (Index 0)"
                }
            ],
            properties: {
                base_weight: baseMass * 1000, // grams
                peak_voltage: parseFloat(peakVoltage.toFixed(1)),
                max_lift_percentage: parseFloat(maxLiftPercent.toFixed(2)),
                telemetry_hash: telemetryHash,
                threshold_voltage: parseFloat(thresholdVoltage.toFixed(1)),
                adversary_buffer: adversaryBuffer
            },
            telemetry: telemetryHistory
        };
    }

    /**
     * Converts metadata to base64-encoded JSON for on-chain storage.
     * @param metadata Full metadata object
     * @returns Base64 string suitable for contract storage
     */
    public static toBase64(metadata: ExperimentMetadata): string {
        const json = JSON.stringify(metadata);
        return Buffer.from(json).toString('base64');
    }

    /**
     * Generates a data URI for the metadata JSON.
     * @param metadata Full metadata
     * @returns data:application/json;base64,... URI
     */
    public static toDataURI(metadata: ExperimentMetadata): string {
        return `data:application/json;base64,${this.toBase64(metadata)}`;
    }

    /**
     * Generates an SVG visualization of the experiment.
     * @param liftPercent Max lift percentage
     * @param peakVoltage Peak voltage in kV
     * @param thresholdVoltage Voltage where 30% was first achieved
     * @returns SVG data URI
     */
    private static generateSVG(liftPercent: number, peakVoltage: number, thresholdVoltage: number): string {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0f0f1e;stop-opacity:1" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            <!-- Background -->
            <rect width="400" height="400" fill="url(#bg)"/>
            
            <!-- Title -->
            <text x="200" y="40" font-family="monospace" font-size="20" fill="#ec4899" text-anchor="middle" filter="url(#glow)">
                ǃKAGGEN GENESIS
            </text>
            
            <!-- Lift Percentage (Main Metric) -->
            <text x="200" y="150" font-family="monospace" font-size="48" fill="#10b981" text-anchor="middle" font-weight="bold" filter="url(#glow)">
                ${liftPercent.toFixed(1)}%
            </text>
            <text x="200" y="180" font-family="monospace" font-size="14" fill="#06b6d4" text-anchor="middle">
                MASS REDUCTION
            </text>
            
            <!-- Voltage Info -->
            <text x="200" y="230" font-family="monospace" font-size="16" fill="#9ca3af" text-anchor="middle">
                Peak: ${peakVoltage.toFixed(1)}kV
            </text>
            <text x="200" y="255" font-family="monospace" font-size="16" fill="#9ca3af" text-anchor="middle">
                Threshold: ${thresholdVoltage.toFixed(1)}kV
            </text>
            
            <!-- Status Badge -->
            <rect x="100" y="290" width="200" height="40" rx="8" fill="${liftPercent >= 30 ? '#10b981' : '#ef4444'}" opacity="0.2"/>
            <text x="200" y="316" font-family="monospace" font-size="14" fill="${liftPercent >= 30 ? '#10b981' : '#ef4444'}" text-anchor="middle" font-weight="bold">
                ${liftPercent >= 30 ? '🔓 ASCENSION UNLOCKED' : '🔒 THRESHOLD NOT MET'}
            </text>
            
            <!-- Footer -->
            <text x="200" y="370" font-family="monospace" font-size="10" fill="#4b5563" text-anchor="middle">
                INTEGRATION LAYER • TRIBE 0 • RESONANT REALMS
            </text>
        </svg>
        `.trim();

        return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    }
}
