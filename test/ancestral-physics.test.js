const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("🧪 Resonant Realms: Ancestral Utils & Physics", function () {
    let verification;

    before(async function () {
        const PhysicsVerification = await ethers.getContractFactory("PhysicsVerification");
        verification = await PhysicsVerification.deploy();
    });

    describe("Physics Constants", function () {
        it("Should return Zulu (1) constants correctly", async function () {
            const profile = await verification.getProfile(1);
            expect(profile.mass).to.equal(120);
            expect(profile.buoyancy).to.equal(10);
        });

        it("Should return Xhosa (2) constants correctly", async function () {
            const profile = await verification.getProfile(2);
            expect(profile.mass).to.equal(90);
            expect(profile.buoyancy).to.equal(40);
        });
    });

    describe("Genetic Logic (Gen-2)", function () {
        it("Should calculate Ancestral Wisdom correctly", async function () {
            // Formula: UP = (ForgeFailure * MindJitter) / 13
            const wisdom = await verification.calculateAncestralWisdom(13, 2);
            expect(wisdom).to.equal(2);
        });

        it("Should incorporate adversaryBuffer in crossover", async function () {
            const g1 = "0xAAAAAAAAAAAAAAAA";
            const g2 = "0xBBBBBBBBBBBBBBBB";
            const seed = 123;
            const buffer1 = 100;
            const buffer2 = 200;

            const child1 = await verification.crossover(g1, g2, seed, buffer1);
            const child2 = await verification.crossover(g1, g2, seed, buffer2);

            expect(child1).to.not.equal(child2);
        });
    });
});
