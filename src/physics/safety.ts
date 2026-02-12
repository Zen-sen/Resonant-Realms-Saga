
/**
 * @fileoverview Safety Protocols & Integration Checks
 * Manages high-voltage grounding logic and EMF shielding validation.
 */

export interface SafetyStatus {
    grounded: boolean;
    shieldingActive: boolean;
    voltageLevel: number; // Volts
    errorMessage?: string;
}

export class SafetyProtocol {
    private static MAX_SAFE_VOLTAGE = 50000; // 50 kV limit for standard op
    private static CRITICAL_BREAKDOWN_FIELD = 3e6; // 3 MV/m breakdown of air

    /**
     * Checks if the system is safe to operate under given conditions.
     * @param voltage Current voltage level
     * @param gapDistance Gap distance in meters (for field calc)
     * @param isGrounded Ground status check
     * @returns SafetyStatus object
     */
    public checkSystemIntegrity(voltage: number, gapDistance: number, isGrounded: boolean): SafetyStatus {
        const fieldStrength = voltage / gapDistance;
        let active = true;
        let msg = "System Online via Safety Protocol.";

        if (!isGrounded) {
            active = false;
            msg = "CRITICAL FAIL: System not grounded. Discharging capacitors immediately.";
        } else if (fieldStrength > SafetyProtocol.CRITICAL_BREAKDOWN_FIELD) {
            active = false;
            msg = `DANGER: Field strength ${fieldStrength.toExponential(2)} V/m exceeds breakdown threshold. Arcing imminent.`;
        } else if (voltage > SafetyProtocol.MAX_SAFE_VOLTAGE) {
            // Warning only, unless strict mode
            msg = `WARNING: High Voltage ${voltage / 1000} kV exceeds standard safety limit. Ensure shielding.`;
        }

        return {
            grounded: isGrounded,
            shieldingActive: true, // Mocking active shielding checks
            voltageLevel: voltage,
            errorMessage: active ? undefined : msg
        };
    }

    /**
     * Simulates an emergency shutdown procedure.
     */
    public emergencyShutdown(): void {
        console.log("!!! EMERGENCY SHUTDOWN INITIATED !!!");
        console.log(" -> Cutting HV supply...");
        console.log(" -> Grounding all capacitors...");
        console.log(" -> Venting chamber pressure...");
        console.log("System stable.");
    }
}
