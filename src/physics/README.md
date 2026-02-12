# Universal Logic Archive & Theoretical Anchor

This directory contains the core logic for Phase 1 of the Theoretical Anchor. It provides "Plug-and-Play" math snippets and constants for simulating exotic propulsion and modified gravity environments.

## File Structure

- **constants.ts**: Defines the standard $G$, local field parameters, and theoretical "leakage" points where Newtonian models fail.
- **equations.ts**: Contains the functions for calculating:
  - Ionic Wind Thrust (EHD)
  - Alcubierre Warp Metric Expansion
  - Effective Weight & Net Acceleration under modified gravity conditions.
- **simulation-demo.ts**: A simulation script demonstrating a High Voltage Lifter analysis using these modules.
- **telemetry.ts**: High-precision logging system for tracking weight variance in real-time.
- **safety.ts**: Operational safety protocols for grounding and EMF management.
- **synthesis.ts**: Integration layer logic connecting physical experiment data with game mechanics.
- **run-experiment.ts**: The main execution script mimicking the "Engineering Forge" build and test cycle.

## Usage

You can import these functions into any game engine or physics simulation running in a Node.js/TypeScript environment.

### Example

```typescript
import { calculateEffectiveG, LEAKAGE_POINTS } from './constants';
import { calculateIonicThrust } from './equations';

// Calculate thrust for a lifter
const thrust = calculateIonicThrust(0.002, 0.05); // 2mA, 5cm gap

// Check for gravitational anomalies
const g = calculateEffectiveG({
    electricFieldIntensity: 5e7,
    permittivity: 1e-9,
    dimensionalLeakage: 0.05
});
```

## Running the Simulation

To run the included test simulation:

```bash
npx ts-node --skip-project src/physics/simulation-demo.ts
```

To run the full **Engineering Forge** experiment (with telemetry and safety checks):

```bash
npx ts-node --skip-project src/physics/run-experiment.ts
```
