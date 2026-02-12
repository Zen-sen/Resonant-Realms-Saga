
import { G_STANDARD, LocalFieldParameters, calculateEffectiveG } from './constants';

/**
 * @fileoverview Universal Logic Archive: EHD, Alcubierre, and Displacement Metrics
 * Provides modular functions for calculating exotic propulsion dynamics.
 */

// --- Electrohydrodynamics (EHD) Modules ---

/**
 * Calculates theoretical ionic wind thrust (Standard Biefeld-Brown Interpretation).
 * Based on Townsend Brown's asymmetric capacitor experiments.
 * 
 * Formula (Approximation): F = (I * d) / mu
 * Where:
 * - I is current (Amps)
 * - d is electrode separation (meters)
 * - mu is ion mobility in air (~2e-4 m^2/V.s)
 * 
 * @param current Current in Amps
 * @param separation Distance between electrodes in meters
 * @param ionMobility Mobility of ions in the medium (default: 2e-4 for air)
 * @returns Thrust in Newtons
 */
export function calculateIonicThrust(current: number, separation: number, ionMobility: number = 2e-4, airDensity: number = 1.225): number {
    if (ionMobility <= 0 || airDensity <= 0) return 0;
    // Thrust scales with air density (approximate - less air = fewer ions to push)
    const densityFactor = airDensity / 1.225;
    return ((current * separation) / ionMobility) * densityFactor;
}

/**
 * Alternative EHD formulation using Power and Voltage.
 * F = P / k (Efficiency factor)
 */
export function estimateThrustFromPower(voltage: number, current: number, efficiencyK: number = 20000): number {
    // k is typically in N/W or similar units, highly variable based on geometry.
    // For lifters, efficiency is often cited around 2-100 g/W. Here we use a generic constant.
    return (voltage * current) / efficiencyK;
}


// --- Alcubierre Metrics & Warp Logic ---

/**
 * Calculates the hypothetical expansion scalar required for a warp bubble.
 * Based on Alcubierre metric formulation in simplified 2D:
 * ds^2 = -dt^2 + (dx - v_s f(r_s) dt)^2 + dy^2 + dz^2
 * 
 * @param velocity Apparent velocity of the ship (fraction of c, e.g., >1 for FTL)
 * @param radius Distance from bubble center
 * @param bubbleRadius Radius of the warp bubble
 * @param sigma Thickness parameter of the bubble wall
 * @returns Expansion factor at radius r
 */
export function calculateWarpExpansion(velocity: number, radius: number, bubbleRadius: number, sigma: number): number {
    // The shape function f(r_s)
    // f(r_s) = (tanh(sigma * (r_s + R)) - tanh(sigma * (r_s - R))) / (2 * tanh(sigma * R))

    // Simplification for positive radius r:
    const numerator = Math.tanh(sigma * (radius + bubbleRadius)) - Math.tanh(sigma * (radius - bubbleRadius));
    const denominator = 2 * Math.tanh(sigma * bubbleRadius);

    const shapeFunction = numerator / denominator;

    // Local expansion velocity factor: v_s * f(r_s)
    return velocity * shapeFunction;
}


// --- Mass-Displacement & Gravity Modification ---

/**
 * Calculates the 'effective' weight of an object under modified gravity conditions.
 * Used for "mass-displacement calculations" in game engines or simulations.
 * 
 * @param mass Mass of the object (kg)
 * @param fieldParams Local field parameters (E-field, permittivity, etc.)
 * @returns Effective Weight force vector magnitude (Newtons)
 */
export function calculateEffectiveWeight(mass: number, fieldParams: LocalFieldParameters): number {
    // Standard weight: W = m * g (where g ~ G * M_earth / r^2)
    // Here we assume Earth surface conditions but modify G locally.

    const EarthMass = 5.972e24; // kg
    const EarthRadius = 6.371e6; // m

    const effectiveG = calculateEffectiveG(fieldParams);

    // g_eff = G_eff * M / r^2
    const effectiveGravity = (effectiveG * EarthMass) / Math.pow(EarthRadius, 2);

    return mass * effectiveGravity;
}

/**
 * Calculates the net force vector on a craft considering thrust and modified gravity.
 * 
 * @param mass Mass (kg)
 * @param thrustVector Thrust force vector [x, y, z] (Newtons)
 * @param fieldParams Local field parameters
 * @returns Net acceleration vector [ax, ay, az] (m/s^2)
 */
export function calculateNetAcceleration(
    mass: number,
    thrustVector: [number, number, number],
    fieldParams: LocalFieldParameters
): [number, number, number] {

    const weightMagnitude = calculateEffectiveWeight(mass, fieldParams);
    // Gravity acts downwards (-y direction assumed)
    const gravityVector = [0, -weightMagnitude, 0];

    const netForceX = thrustVector[0] + gravityVector[0];
    const netForceY = thrustVector[1] + gravityVector[1];
    const netForceZ = thrustVector[2] + gravityVector[2];

    return [
        netForceX / mass,
        netForceY / mass,
        netForceZ / mass
    ];
}
