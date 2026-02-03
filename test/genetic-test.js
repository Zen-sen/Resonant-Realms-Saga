const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("🧬 Resonant Realms: Genetic Logic", function () {
  let diamond;
  let factory;
  let owner;

  before(async function () {
    // In a real test, you'd run your deployment logic here
    // For now, we assume the Diamond is at our known address
    const diamondAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    [owner] = await ethers.getSigners();
    
    factory = await ethers.getContractAt("BunnyFactoryFacet", diamondAddress);
  });

  it("Should breathe life into a Khoe-San Genesis (Tribe 0)", async function () {
    const tx = await factory.mintGenesisBunny(0);
    await tx.wait();

    const bunny = await factory.getBunny(2); // Index 2 because we already minted 0 and 1
    const tribeId = Number(bunny.genes & 0xFFFFn);
    const resonance = Number((bunny.genes >> 16n) & 0xFFFFn);

    expect(tribeId).to.equal(0);
    expect(resonance).to.equal(100);
  });

  it("Should correctly identify Synthesis Trait for Tribe 12", async function () {
    const bunny = await factory.getBunny(1); // Our Coloured Tribe Bunny
    const tribeId = Number(bunny.genes & 0xFFFFn);
    
    expect(tribeId).to.equal(12);
  });
});
