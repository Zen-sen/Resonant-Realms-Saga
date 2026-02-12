
import { calculateEffectiveWeight } from './equations';
import { LocalFieldParameters } from './constants';

/**
 * @fileoverview Telemetric Logging System
 * Logs weight-variance and other critical metrics for the Antigravity Research module.
 */

export interface TelemetryDataPoint {
    timestamp: number;
    weight: number; // Newtons
    variance: number; // Difference from standard weight
    fieldParams: LocalFieldParameters;
}

export class TelemetricLogger {
    private baselineWeight: number;
    private logHistory: TelemetryDataPoint[] = [];

    constructor(private mass: number) {
        // Calculate baseline weight under standard conditions
        this.baselineWeight = calculateEffectiveWeight(mass, {
            electricFieldIntensity: 0,
            permittivity: 8.854e-12, // Vacuum permittivity
            dimensionalLeakage: 0
        });
    }

    /**
     * capturing a single data point based on current field parameters.
     * @param params Current local field parameters
     * @param measuredWeight Optional: Actual weight reading from sensor (Newtons)
     * @returns The captured data point
     */
    public log(params: LocalFieldParameters, measuredWeight?: number): TelemetryDataPoint {
        const currentWeight = measuredWeight !== undefined ? measuredWeight : calculateEffectiveWeight(this.mass, params);
        // Variance is: (Baseline - Current). Positive = Weight Loss.
        const variance = this.baselineWeight - currentWeight;

        const dataPoint: TelemetryDataPoint = {
            timestamp: Date.now(),
            weight: currentWeight,
            variance: variance,
            fieldParams: params
        };

        this.logHistory.push(dataPoint);
        return dataPoint;
    }

    /**
     * Formatting the latest log entry as a string for console output.
     */
    public getLatestLogString(): string {
        const latest = this.logHistory[this.logHistory.length - 1];
        if (!latest) return "No data logged.";

        return `[${new Date(latest.timestamp).toISOString()}] Weight: ${latest.weight.toFixed(6)} N | Variance: ${latest.variance.toExponential(4)} N | E-Field: ${latest.fieldParams.electricFieldIntensity.toExponential(2)} V/m`;
    }

    /**
     * Dumps the entire log history.
     */
    public getHistory(): TelemetryDataPoint[] {
        return this.logHistory;
    }
}
