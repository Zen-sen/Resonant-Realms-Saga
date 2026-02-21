const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("🧪 Resonant Realms: 0xFFFE Foundation Test", function () {
    let antigravity, factory, breeding, mentorship;
    let deployer;
    const DIAMOND_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    before(async function () {
        [deployer] = await ethers.getSigners();
        antigravity = await ethers.getContractAt("AntigravityFacet", DIAMOND_ADDRESS);
        factory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);
        breeding = await ethers.getContractAt("BreedingFacet", DIAMOND_ADDRESS);
        mentorship = await ethers.getContractAt("MentorshipFacet", DIAMOND_ADDRESS);
    });

    it("Should preserve Bit 0 (Khoe-San Foundation) during crossover even with maximum noise", async function () {
        console.log("   --- Setup Parent Lineage ---");
        // Record Experiment with high buffer (255)
        const telHash = ethers.keccak256(ethers.toUtf8Bytes("live_fire_test_" + Date.now()));
        try {
            await (await antigravity.recordExperiment(3500, 5000, telHash, "ipfs://test", 255)).wait();
        } catch (e) {
            console.log("   (Experiment already recorded for this signer)");
        }

        // Grant resonance for breeding
        await (await mentorship.recordAwakening(5000)).wait();
        const bal = await mentorship.getUbuntuPoints(deployer.address);
        console.log(`   Player Balance: ${bal} UP`);

        // Mint parents with Bit 0 set to 1
        const genes1 = 1n; // 0001
        const genes2 = 1n; // 0001

        await (await factory.breatheSage(genes1, 0)).wait();
        const matronId = (await factory.totalSages()) - 1n;

        await (await factory.breatheSage(genes2, 0)).wait();
        const sireId = (await factory.totalSages()) - 1n;

        console.log(`   Parents: Matron[${matronId}] Sire[${sireId}]`);

        // Breed
        console.log("   --- Initiating Breeding ---");
        const breedTx = await breeding.breed(matronId, sireId);
        await breedTx.wait();

        const childId = (await factory.totalSages()) - 1n;
        const child = await breeding.getBunny(childId);
        const childGenes = BigInt(child.genes);

        console.log(`   Child Genes: 0x${childGenes.toString(16)}`);
        console.log(`   Foundation Bit: ${childGenes & 1n}`);

        expect(childGenes & 1n).to.equal(1n, "Foundation Bit 0 was mutated! The rule is violated.");
        console.log("   ✅ Foundation Bit Invariance Confirmed.");
    });
});
