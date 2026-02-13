/**
 * @fileoverview Physics Web Worker
 * Runs antigravity physics calculations in background thread to maintain 60fps UI.
 * 
 * Receives: Voltage updates from main thread
 * Computes: Telemetry data (weight, variance, lift %)
 * Returns: TELEMETRY_UPDATE messages
 */

import { TelemetricLogger } from '../physics/telemetry';
import { SafetyProtocol } from '../physics/safety';
import { SynthesisCheck, IntegrationLayerType } from '../physics/synthesis';
import { calculateIonicThrust, calculateEffectiveWeight } from '../physics/equations';

const TEST_MASS = 0.5; // 500g
const GAP_DISTANCE = 0.05; // 5cm

let LOGGER: TelemetricLogger | null = null;
let SAFETY: SafetyProtocol | null = null;
let SYNTHESIS: SynthesisCheck | null = null;
let currentVoltage = 0;
let vacuumMode = false;
let adversaryBuffer = 5; // Phase 1: Ubuntu Mercy - Pre-seeded with 1 legacy lesson (5 pts)

// Initialize when worker starts
function initialize(isVacuum: boolean) {
    LOGGER = new TelemetricLogger(TEST_MASS);
    SAFETY = new SafetyProtocol();
    SYNTHESIS = new SynthesisCheck(IntegrationLayerType.SIMULATED_FRAMEWORK);
    vacuumMode = isVacuum;
    currentVoltage = 0;
    // Note: adversaryBuffer persists across resets to enable "Mercy"
}

// Calculate physics for current voltage
function calculateStep(voltage: number): void {
    if (!LOGGER || !SAFETY || !SYNTHESIS) return;

    const eField = voltage / GAP_DISTANCE;

    // Dimensional leakage (gravity modification)
    let leakage = 0;

    // --- Phase 1: Ubuntu Mercy ---
    // Every lesson encoded (buffer) reduces the gravity constant slightly, 
    // making it easier to achieve lift. 0.1% boost per buffer point.
    const mercyFactor = 1 + (adversaryBuffer * 0.001);

    if (voltage > 35000) {
        // The 35kV "Breakthrough Point" - Integration Layer activation
        leakage = ((voltage - 35000) / 25000) * 0.40 * mercyFactor;
    }

    const fieldParams = {
        electricFieldIntensity: eField,
        permittivity: 8.854e-12,
        dimensionalLeakage: Math.min(0.99, leakage) // Cap leakage
    };

    // Calculate forces
    const gravityForce = calculateEffectiveWeight(TEST_MASS, fieldParams);
    const current = (voltage / 60000) * 0.002;
    const airDensity = vacuumMode ? 0.001 : 1.225;
    const ionThrust = calculateIonicThrust(current, GAP_DISTANCE, 2e-4, airDensity);

    // Net weight on scale
    let measuredWeight = gravityForce - ionThrust;
    if (measuredWeight < 0) measuredWeight = 0;

    // Log telemetry
    const logEntry = LOGGER.log(fieldParams, measuredWeight);

    // Safety check
    const safetyStatus = SAFETY.checkSystemIntegrity(voltage, GAP_DISTANCE, true);

    // Synthesis check
    const synthesis = SYNTHESIS.checkIntegration(logEntry, safetyStatus, ionThrust);

    // Sync buffer from synthesis
    const match = synthesis.message.match(/Buffer: (\d+)/);
    if (match) {
        adversaryBuffer = parseInt(match[1]);
    }

    // Send update to main thread
    self.postMessage({
        type: 'TELEMETRY_UPDATE',
        data: {
            telemetry: logEntry,
            safetyStatus,
            synthesis: synthesis.message,
            adversaryBuffer // Explicitly pass it back
        }
    });
}

// Listen for messages from main thread
self.onmessage = (event) => {
    const { type, voltage, vacuumMode: isVacuum } = event.data;

    switch (type) {
        case 'START_EXPERIMENT':
            initialize(isVacuum || false);
            self.postMessage({ type: 'EXPERIMENT_STARTED' });
            break;

        case 'UPDATE_VOLTAGE':
            currentVoltage = voltage;
            calculateStep(voltage);
            break;

        case 'RESET':
            initialize(vacuumMode);
            currentVoltage = 0;
            self.postMessage({ type: 'EXPERIMENT_RESET' });
            break;

        case 'GET_HISTORY':
            if (LOGGER) {
                self.postMessage({
                    type: 'HISTORY_RESPONSE',
                    data: { history: LOGGER.getHistory() }
                });
            }
            break;
    }
};
