/**
 * @title Seed All 13 Tribes — Resonant Realms Saga
 * @description Calls initializeTribalMatrix() to seed all 13 South African tribes
 *              into the Diamond Stone in a single transaction.
 * 
 * Usage:
 *   npx hardhat run scripts/seed-all-tribes.js --network localhost
 *   npx hardhat run scripts/seed-all-tribes.js --network pi_testnet
 * 
 * Prerequisites:
 *   - Diamond must be deployed
 *   - AncestralHeritageFacet must be inscribed into the Diamond
 *   - Caller must be contractOwner
 */

const { ethers } = require("hardhat");

// All 13 tribes with their expected physics profiles (for verification)
const TRIBES = [
    { id: 0, name: "Khoe-San", mass: 150, buoyancy: 0, role: "Foundation" },
    { id: 1, name: "Zulu", mass: 180, buoyancy: 20, role: "Lightning Mass" },
    { id: 2, name: "Xhosa", mass: 80, buoyancy: 60, role: "Resonance Buoyancy" },
    { id: 3, name: "Sotho", mass: 100, buoyancy: 30, role: "Steadfast Bridge" },
    { id: 4, name: "Setswana", mass: 100, buoyancy: 30, role: "Diplomatic Balance" },
    { id: 5, name: "Sepedi", mass: 50, buoyancy: 90, role: "Regenerative Healer" },
    { id: 6, name: "Xitsonga", mass: 100, buoyancy: 50, role: "Xibelani Spin" },
    { id: 7, name: "Swati", mass: 90, buoyancy: 40, role: "Ceremonial Dancer" },
    { id: 8, name: "Venda", mass: 120, buoyancy: 35, role: "Mystic Anchor" },
    { id: 9, name: "isiNdebele", mass: 90, buoyancy: 50, role: "Symmetric Harmony" },
    { id: 10, name: "Tsonga", mass: 85, buoyancy: 55, role: "Coastal Drift" },
    { id: 11, name: "Afrikaans", mass: 130, buoyancy: 25, role: "Frontier Forge" },
    { id: 12, name: "Synthesis", mass: 70, buoyancy: 80, role: "Integration Bridge" },
];

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("\n═══════════════════════════════════════════════════════");
    console.log("  🌍 Resonant Realms: Tribal Matrix Seeding");
    console.log("═══════════════════════════════════════════════════════");
    console.log(`  Architect:  ${deployer.address}`);

    // Default to the standard Hardhat local deployment address
    const DIAMOND_ADDRESS = process.env.DIAMOND_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log(`  Diamond:    ${DIAMOND_ADDRESS}\n`);

    const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);

    // Check if already initialized
    try {
        const tribe0 = await heritage.getTribe(0);
        if (tribe0.isActive) {
            console.log("  ⚠️  Tribal matrix already initialized. Verifying...\n");
            await verifyTribes(heritage);
            return;
        }
    } catch (e) {
        // Not yet initialized, proceed
    }

    // Seed all tribes in one transaction
    console.log("  📜 Calling initializeTribalMatrix()...");
    const tx = await heritage.initializeTribalMatrix();
    const receipt = await tx.wait();
    console.log(`  ✅ Transaction confirmed! Gas: ${receipt.gasUsed.toString()}\n`);

    // Verify all tribes
    await verifyTribes(heritage);
}

async function verifyTribes(heritage) {
    console.log("  ─── Verification ───────────────────────────────────\n");
    let passCount = 0;

    for (const tribe of TRIBES) {
        const result = await heritage.getTribe(tribe.id);
        const nameMatch = result.name === tribe.name;
        const activeMatch = result.isActive === true;

        if (nameMatch && activeMatch) {
            console.log(`  ✅ [${String(tribe.id).padStart(2)}] ${tribe.name.padEnd(12)} — ${tribe.role}`);
            passCount++;
        } else {
            console.log(`  ❌ [${String(tribe.id).padStart(2)}] Expected: ${tribe.name} (active: true)`);
            console.log(`                 Got: ${result.name} (active: ${result.isActive})`);
        }
    }

    console.log(`\n  ─── Result: ${passCount}/13 tribes verified ────────────\n`);

    if (passCount === 13) {
        console.log("  🌍 The Tribal Matrix is complete. All nations breathe.\n");
    } else {
        console.log("  ⚠️  Some tribes need attention. Use setTribe() for manual repair.\n");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
