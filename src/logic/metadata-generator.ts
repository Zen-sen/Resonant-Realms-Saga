import { TelemetryDataPoint } from '../physics/telemetry';
import { ethers } from 'ethers';

/**
 * @fileoverview Universal Metadata Generator
 * The "Vessel" that encodes the Observer's journey into a permanent artifact.
 */

export interface ExperimentMetadata {
    name: string;
    description: string;
    image: string; // Base64 SVG
    attributes: Array<{
        trait_type: string;
        value: string | number;
        display_type?: string;
    }>;
    properties: {
        base_weight: number;
        peak_voltage: number;
        max_lift_percentage: number;
        telemetry_hash: string;
        threshold_voltage: number;
        adversary_buffer: number;
    };
    telemetry: TelemetryDataPoint[];
}

export class MetadataGenerator {

    public static generate(
        history: TelemetryDataPoint[],
        baseMass: number,
        adversaryBuffer: number = 0
    ): ExperimentMetadata {
        const baseWeightN = baseMass * 9.81;

        let peakVariance = 0;
        let peakVoltage = 0;
        let thresholdVoltage = 0;

        history.forEach(point => {
            if (point.variance > peakVariance) {
                peakVariance = point.variance;
                peakVoltage = point.fieldParams.electricFieldIntensity * 0.05 / 1000;
            }
            const liftPercent = (point.variance / baseWeightN) * 100;
            if (liftPercent >= 30 && thresholdVoltage === 0) {
                thresholdVoltage = point.fieldParams.electricFieldIntensity * 0.05 / 1000;
            }
        });

        const maxLiftPercent = (peakVariance / baseWeightN) * 100;

        // Telemetry Compression (Record of Truth)
        const telemetryJSON = JSON.stringify(history);
        const telemetryHash = ethers.keccak256(ethers.toUtf8Bytes(telemetryJSON));

        const description = `This initiate mastered the Integration Layer at ${peakVoltage.toFixed(1)}kV, achieving ${maxLiftPercent.toFixed(2)}% mass reduction. A verified artifact of the Resonant Realms Saga.`;

        return {
            name: "ǃKaggen Genesis Experiment",
            description,
            image: this.generateGenerativeSVG(history, baseWeightN, maxLiftPercent),
            attributes: [
                { trait_type: "Max Lift %", value: parseFloat(maxLiftPercent.toFixed(2)), display_type: "number" },
                { trait_type: "Peak Voltage (kV)", value: parseFloat(peakVoltage.toFixed(1)), display_type: "number" },
                { trait_type: "Threshold Voltage (kV)", value: parseFloat(thresholdVoltage.toFixed(1)), display_type: "number" },
                { trait_type: "Adversary Buffer", value: adversaryBuffer, display_type: "number" },
                { trait_type: "Test Mass (g)", value: baseMass * 1000, display_type: "number" },
                { trait_type: "Tribe", value: "0: Khoe-San" }
            ],
            properties: {
                base_weight: baseMass * 1000,
                peak_voltage: parseFloat(peakVoltage.toFixed(1)),
                max_lift_percentage: parseFloat(maxLiftPercent.toFixed(2)),
                telemetry_hash: telemetryHash,
                threshold_voltage: parseFloat(thresholdVoltage.toFixed(1)),
                adversary_buffer: adversaryBuffer
            },
            telemetry: history
        };
    }

    public static toBase64(metadata: ExperimentMetadata): string {
        const json = JSON.stringify(metadata);
        // Browser-safe Base64 encoding
        return btoa(unescape(encodeURIComponent(json)));
    }

    public static toDataURI(metadata: ExperimentMetadata): string {
        return `data:application/json;base64,${this.toBase64(metadata)}`;
    }

    private static generateGenerativeSVG(history: TelemetryDataPoint[], baseWeight: number, maxLift: number): string {
        // Chart Config
        const width = 400;
        const height = 400;
        const padding = 60;
        const chartW = width - padding * 2;
        const chartH = height - padding * 2;

        // Path Generation (Lift Curve)
        let pathData = "";
        history.forEach((point, i) => {
            const x = padding + (i / (history.length - 1)) * chartW;
            const liftPercent = (point.variance / baseWeight) * 100;
            // Map lift 0-100% to chart height (inverted Y)
            const y = (padding + chartH) - (liftPercent / 100) * chartH;

            if (i === 0) pathData += `M ${x} ${y}`;
            else pathData += ` L ${x} ${y}`;
        });

        const svg = `
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#050505;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
        </linearGradient>
        <filter id="neon">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>

    <!-- Background -->
    <rect width="400" height="400" fill="url(#bgGrad)" rx="12" />
    
    <!-- Grid lines -->
    <line x1="${padding}" y1="${padding + chartH}" x2="${padding + chartW}" y2="${padding + chartH}" stroke="#333" stroke-width="1" />
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${padding + chartH}" stroke="#333" stroke-width="1" />
    
    <!-- Threshold Line (30%) -->
    <line x1="${padding}" y1="${(padding + chartH) - 0.3 * chartH}" x2="${padding + chartW}" y2="${(padding + chartH) - 0.3 * chartH}" 
          stroke="#ef4444" stroke-width="1" stroke-dasharray="4" opacity="0.5" />
    <text x="${padding + chartW + 5}" y="${(padding + chartH) - 0.3 * chartH + 3}" fill="#ef4444" font-family="monospace" font-size="8">30%</text>

    <!-- The Lift Curve -->
    <path d="${pathData}" fill="none" stroke="#06b6d4" stroke-width="2" filter="url(#neon)" />

    <!-- Fill under curve -->
    <path d="${pathData} L ${padding + chartW} ${padding + chartH} L ${padding} ${padding + chartH} Z" fill="#06b6d4" opacity="0.1" />

    <!-- Title & Stats -->
    <text x="50%" y="40" text-anchor="middle" fill="#ec4899" font-family="monospace" font-size="16" font-weight="bold" filter="url(#neon)">ǃKAGGEN ASCENSION</text>
    
    <text x="${padding}" y="${height - 20}" fill="#10b981" font-family="monospace" font-size="12">LIFT: ${maxLift.toFixed(2)}%</text>
    <text x="${width - padding}" y="${height - 20}" text-anchor="end" fill="#9ca3af" font-family="monospace" font-size="12">RESONANT REALMS</text>

    <!-- Mantis Glyph (simplified) -->
    <path d="M 320 60 L 340 40 L 360 60 L 340 80 Z" fill="none" stroke="#ec4899" stroke-width="1" opacity="0.3" />
</svg>
        `.trim();

        // Browser-safe Base64 encoding for SVG
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    }
}
