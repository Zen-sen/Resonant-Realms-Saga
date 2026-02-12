import { runEngineeringForge } from '../src/physics/run-experiment';
import { TelemetricLogger } from '../src/physics/telemetry';
import { ExperimentNFTGenerator } from '../src/utils/ExperimentMetadata';
import * as fs from 'fs';
import * as path from 'path';

/**
 * @fileoverview Test script for NFT metadata generation
 * Runs a full experiment and generates the complete metadata package.
 * Usage: npx ts-node --skip-project scripts/test-nft-metadata.ts
 */

async function main() {
    console.log("🧪 TESTING NFT METADATA GENERATION");
    console.log("=".repeat(60));

    // Step 1: Run experiment
    console.log("\n[1/4] Running full experiment simulation...");

    // We'll manually run the experiment to capture telemetry
    const { TelemetricLogger } = await import('../src/physics/telemetry');
    const { SafetyProtocol } = await import('../src/physics/safety');
    const { SynthesisCheck, IntegrationLayerType } = await import('../src/physics/synthesis');
    const { calculateIonicThrust, calculateEffectiveWeight } = await import('../src/physics/equations');

    const SAFETY = new SafetyProtocol();
    const TEST_MASS = 0.5; // 500g
    const LOGGER = new TelemetricLogger(TEST_MASS);
    const SYNTHESIS = new SynthesisCheck(IntegrationLayerType.SIMULATED_FRAMEWORK);

    let voltage = 0;
    const MAX_VOLTAGE = 60000;
    const STEP = 5000;
    const GAP_DISTANCE = 0.05;
    const AIR_DENSITY = 0.001; // Vacuum mode

    let adversaryBuffer = 0;

    // Run simulation
    while (voltage <= MAX_VOLTAGE) {
        const eField = voltage / GAP_DISTANCE;
        let leakage = 0;

        if (voltage > 35000) {
            leakage = ((voltage - 35000) / 25000) * 0.40;
        }

        const fieldParams = {
            electricFieldIntensity: eField,
            permittivity: 8.854e-12,
            dimensionalLeakage: leakage
        };

        const gravityForce = calculateEffectiveWeight(TEST_MASS, fieldParams);
        const current = (voltage / 60000) * 0.002;
        const ionThrust = calculateIonicThrust(current, GAP_DISTANCE, 2e-4, AIR_DENSITY);
        let measuredWeight = gravityForce - ionThrust;
        if (measuredWeight < 0) measuredWeight = 0;

        const logEntry = LOGGER.log(fieldParams, measuredWeight);
        const safetyStatus = SAFETY.checkSystemIntegrity(voltage, GAP_DISTANCE, true);
        const synthesis = SYNTHESIS.checkIntegration(logEntry, safetyStatus, ionThrust);

        // Extract adversary buffer (would need getter in real implementation)
        if (synthesis.message.includes("Buffer")) {
            const match = synthesis.message.match(/Buffer: (\d+)/);
            if (match) adversaryBuffer = parseInt(match[1]);
        }

        voltage += STEP;
    }

    const telemetryHistory = LOGGER.getHistory();
    console.log(`✅ Experiment completed. ${telemetryHistory.length} data points collected.`);

    // Step 2: Generate metadata
    console.log("\n[2/4] Generating NFT metadata...");
    const metadata = ExperimentNFTGenerator.generateMetadata(
        telemetryHistory,
        TEST_MASS,
        adversaryBuffer
    );

    console.log(`✅ Metadata generated:`);
    console.log(`   • Name: ${metadata.name}`);
    console.log(`   • Max Lift: ${metadata.properties.max_lift_percentage}%`);
    console.log(`   • Peak Voltage: ${metadata.properties.peak_voltage}kV`);
    console.log(`   • Threshold Voltage: ${metadata.properties.threshold_voltage}kV`);
    console.log(`   • Telemetry Hash: ${metadata.properties.telemetry_hash}`);
    console.log(`   • Adversary Buffer: ${metadata.properties.adversary_buffer}`);

    // Step 3: Export files
    console.log("\n[3/4] Exporting metadata files...");

    const outputDir = path.join(__dirname, '../artifacts/nft-metadata');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Export full JSON
    fs.writeFileSync(
        path.join(outputDir, 'genesis-experiment.json'),
        JSON.stringify(metadata, null, 2)
    );
    console.log(`✅ Full metadata: artifacts/nft-metadata/genesis-experiment.json`);

    // Export OpenSea subset (without full telemetry for size)
    const openSeaMetadata = {
        ...metadata,
        telemetry: undefined // Remove large telemetry array for OpenSea
    };
    fs.writeFileSync(
        path.join(outputDir, 'opensea-metadata.json'),
        JSON.stringify(openSeaMetadata, null, 2)
    );
    console.log(`✅ OpenSea metadata: artifacts/nft-metadata/opensea-metadata.json`);

    // Export SVG
    const svgMatch = metadata.image.match(/base64,(.+)$/);
    if (svgMatch) {
        const svgContent = Buffer.from(svgMatch[1], 'base64').toString('utf-8');
        fs.writeFileSync(
            path.join(outputDir, 'genesis-experiment.svg'),
            svgContent
        );
        console.log(`✅ SVG visualization: artifacts/nft-metadata/genesis-experiment.svg`);
    }

    // Step 4: Generate smart contract call data
    console.log("\n[4/4] Generating smart contract call data...");

    const liftPercentBasisPoints = Math.floor(metadata.properties.max_lift_percentage * 100);
    const peakVoltage = Math.floor(metadata.properties.peak_voltage * 100);
    const telemetryHash = metadata.properties.telemetry_hash;

    console.log(`\n📋 CONTRACT CALL PARAMETERS:`);
    console.log(`   recordExperiment(`);
    console.log(`     ${liftPercentBasisPoints}, // _liftPercent (${metadata.properties.max_lift_percentage}%)`);
    console.log(`     ${peakVoltage}, // _peakVoltage (${metadata.properties.peak_voltage}kV)`);
    console.log(`     "${telemetryHash}" // _telemetryHash`);
    console.log(`   )`);

    console.log("\n" + "=".repeat(60));
    console.log("✨ TEST COMPLETE: All metadata files generated successfully!");
    console.log("🔗 Ready for blockchain integration.");
}

main().catch(console.error);
