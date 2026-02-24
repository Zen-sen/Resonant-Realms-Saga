const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("🧪 Resonant Realms: 0xFFFE Foundation Test", function () {
    let verification;
    let deployer;

    before(async function () {
        [deployer] = await ethers.getSigners();

        // Use PhysicsVerification helper to test crossover and FORCE_MASK
        const PhysicsVerification = await ethers.getContractFactory("PhysicsVerification");
        verification = await PhysicsVerification.deploy();
    });

    it("Should preserve Bit 0 from Sire in crossover (FORCE_MASK 0xFFFE)", async function () {
        // Sire has Bit 0 set (Foundation), Matron does not
        const matronGenes = 0n;
        const sireGenes = 1n;
        const seed = 12345;
        const adversaryBuffer = 255; // Maximum buffer (worst-case noise)

        const childGenes = await verification.crossover(matronGenes, sireGenes, seed, adversaryBuffer);
        const childBigInt = BigInt(childGenes);

        console.log(`   Matron Genes:  0x${matronGenes.toString(16)}`);
        console.log(`   Sire Genes:    0x${sireGenes.toString(16)}`);
        console.log(`   Child Genes:   0x${childBigInt.toString(16)}`);
        console.log(`   Foundation Bit: ${childBigInt & 1n}`);

        // Bit 0 in crossover comes from sire's low bits (mask clears matron's low bits)
        expect(childBigInt & 1n).to.equal(1n, "Foundation Bit 0 was mutated by noise! FORCE_MASK violation.");
        console.log("   ✅ Foundation Bit Invariance Confirmed (Sire→Child).");
    });

    it("Should NOT set Bit 0 if neither parent has it", async function () {
        const matronGenes = 0n;
        const sireGenes = 0n;
        const seed = 99999;
        const adversaryBuffer = 128;

        const childGenes = await verification.crossover(matronGenes, sireGenes, seed, adversaryBuffer);
        const childBigInt = BigInt(childGenes);

        console.log(`   Child Genes (no foundation): 0x${childBigInt.toString(16)}`);
        console.log(`   Foundation Bit: ${childBigInt & 1n}`);

        // FORCE_MASK ensures noise can never SET Bit 0 — it's always cleared by 0xFFFE
        expect(childBigInt & 1n).to.equal(0n, "Bit 0 was spontaneously created! FORCE_MASK failed.");
        console.log("   ✅ No spontaneous Foundation Bit creation confirmed.");
    });

    it("Should produce different children with different adversaryBuffers", async function () {
        const g1 = "0xAAAAAAAAAAAAAAAA";
        const g2 = "0xBBBBBBBBBBBBBBBB";
        const seed = 42;

        const child1 = await verification.crossover(g1, g2, seed, 50);
        const child2 = await verification.crossover(g1, g2, seed, 200);

        expect(child1).to.not.equal(child2, "AdversaryBuffer should influence crossover outcome");
        console.log("   ✅ AdversaryBuffer diversity confirmed.");
    });

    it("Should verify FORCE_MASK bit-level protection across 10 random seeds", async function () {
        // Sire always has Bit 0 → child must always keep Bit 0
        for (let seed = 1; seed <= 10; seed++) {
            const childGenes = await verification.crossover(0, 1, seed * 7919, seed * 13);
            const childBigInt = BigInt(childGenes);
            expect(childBigInt & 1n).to.equal(1n,
                `Seed ${seed}: Foundation Bit was lost!`);
        }
        console.log("   ✅ 10/10 random-seed Foundation Bit tests passed.");
    });
});
