
import { calculateEffectiveG, LEAKAGE_POINTS } from './constants';
import { calculateIonicThrust, calculateNetAcceleration } from './equations';

/**
 * Example Simulation: High Voltage Lifter Analysis
 */
console.log("=== Theoretical Anchor: Phase 1 Simulation ===");
console.log("Analyzing Gravitational Constant Stability & EHD Thrust...");

// 1. Define Local Parameters for a standard HV experiment
const experimentParams = {
    electricFieldIntensity: 30000, // 30 kV/m (Standard lab condition)
    permittivity: 8.854e-12, // Permittivity of free space
    dimensionalLeakage: 0
};

// 2. Calculate initial G
const standardG = calculateEffectiveG(experimentParams);
console.log(`[Standard Lab] Effective G: ${standardG.toExponential(4)} m^3 kg^-1 s^-2`);

// 3. Crank up the voltage to theoretical "Breakdown" levels
const theoreticalParams = {
    electricFieldIntensity: 5e7, // 50 MV/m (Near breakdown or in special dielectric)
    permittivity: 1e-9, // High-K dielectric material
    dimensionalLeakage: 0.05 // Hypothetical 5% leakage into extra dimensions
};

const modifiedG = calculateEffectiveG(theoreticalParams);
console.log(`[Theoretical Limit] Effective G: ${modifiedG.toExponential(4)} m^3 kg^-1 s^-2`);
console.log(`Gravity Reduction Factor: ${(1 - modifiedG / standardG) * 100}%`);

// 4. EHD Thrust Calculation
console.log("\n--- Propulsion Metrics ---");
const current = 0.002; // 2 mA
const separation = 0.05; // 5 cm
const thrust = calculateIonicThrust(current, separation);
console.log(`EHD Thrust (Ionic Wind): ${thrust.toExponential(4)} N`);

// 5. Net Acceleration Simulation (10g Lifter)
const mass = 0.01; // 10 grams
const netAccel = calculateNetAcceleration(
    mass,
    [0, thrust, 0], // Thrust upwards (+y)
    theoreticalParams // Using modified gravity environment
);

console.log(`Net Acceleration Vector (m/s^2): [${netAccel.map(n => n.toFixed(4)).join(', ')}]`);
if (netAccel[1] > 0) {
    console.log("RESULT: LIFTOFF ACHIEVED (Theoretical)");
} else {
    console.log("RESULT: GROUNDED");
}

console.log("\n--- Leakage Point Identification ---");
console.log(`Critical threshold for Electro-Gravitic coupling: ${LEAKAGE_POINTS.ELECTRO_GRAVITIC_THRESHOLD.fieldStrength.toExponential(2)} V/m`);
