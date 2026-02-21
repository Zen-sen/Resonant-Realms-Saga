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
            expect(profile.mass).to.equal(180);
            expect(profile.buoyancy).to.equal(20);
        });

        it("Should return Xhosa (2) constants correctly", async function () {
            const profile = await verification.getProfile(2);
            expect(profile.mass).to.equal(80);
            expect(profile.buoyancy).to.equal(60);
        });

        it("Should return Sotho (3) constants correctly", async function () {
            const profile = await verification.getProfile(3);
            expect(profile.mass).to.equal(100);
            expect(profile.buoyancy).to.equal(30);
        });

        it("Should return Setswana (4) constants correctly", async function () {
            const profile = await verification.getProfile(4);
            expect(profile.mass).to.equal(100);
            expect(profile.buoyancy).to.equal(30);
        });

        it("Should return Sepedi (5) constants correctly", async function () {
            const profile = await verification.getProfile(5);
            expect(profile.mass).to.equal(50);
            expect(profile.buoyancy).to.equal(90);
        });
    });

    describe("Genetic Logic (Gen-2)", function () {
        it("Should calculate Ancestral Wisdom and enforce bounds (Clamping)", async function () {
            // Case 1: Within bounds
            // (20 * 13) / 13 = 20
            const wisdom1 = await verification.calculateAncestralWisdom(20, 13);
            expect(wisdom1).to.equal(20);

            // Case 2: Below floor bounds
            // Forge 10 -> 15, Jitter 0 -> 1
            // (15 * 1) / 13 = 1
            const wisdom2 = await verification.calculateAncestralWisdom(10, 0);
            expect(wisdom2).to.equal(1);

            // Case 3: Above ceiling bounds
            // Forge 30 -> 22, Jitter 100 -> 65
            // (22 * 65) / 13 = 110
            const wisdom3 = await verification.calculateAncestralWisdom(30, 100);
            expect(wisdom3).to.equal(110);
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
