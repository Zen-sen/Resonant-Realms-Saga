const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Antigravity Gas Audit", function () {
    let antigravityFacet;
    let owner;

    beforeEach(async function () {
        [owner] = await ethers.getSigners();
        const AntigravityFacet = await ethers.getContractFactory("AntigravityFacet");
        antigravityFacet = await AntigravityFacet.deploy();
    });

    it("Should measure gas for recording a standard experiment", async function () {
        const liftPercent = 3500; // 35%
        const peakVoltage = 5000; // 50kV
        const telemetryHash = ethers.keccak256(ethers.toUtf8Bytes("test-telemetry"));

        // Typical Base64 URI (approx 2KB)
        const metadataURI = "data:application/json;base64," + "A".repeat(2048);

        const tx = await antigravityFacet.recordExperiment(
            liftPercent,
            peakVoltage,
            telemetryHash,
            metadataURI
        );

        const receipt = await tx.wait();
        console.log(`\n⛽ Gas Used (2KB Metadata): ${receipt.gasUsed.toString()}`);

        // Estimated cost on Pi/Mainnet (assuming gas price)
        // Adjust these numbers based on target network specs
    });

    it("Should measure gas for a large experiment (4KB Metadata)", async function () {
        const liftPercent = 4000;
        const peakVoltage = 6000;
        const telemetryHash = ethers.keccak256(ethers.toUtf8Bytes("large-telemetry"));
        const metadataURI = "data:application/json;base64," + "B".repeat(4096);

        const tx = await antigravityFacet.recordExperiment(
            liftPercent,
            peakVoltage,
            telemetryHash,
            metadataURI
        );

        const receipt = await tx.wait();
        console.log(`⛽ Gas Used (4KB Metadata): ${receipt.gasUsed.toString()}`);
    });
});
