const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("🧬 Resonant Realms: Genetic Logic", function () {
  let humanFactory;
  let owner;

  before(async function () {
    [owner] = await ethers.getSigners();

    // Deploy HumanFactoryFacet standalone for unit testing
    const HumanFactory = await ethers.getContractFactory("HumanFactoryFacet");
    humanFactory = await HumanFactory.deploy();
  });

  it("Should correctly report awakening path for Khoe-San (Tribe 0)", async function () {
    const path = await humanFactory.getAwakeningPath(0);
    expect(path.baseFreq).to.equal(44);
    expect(path.boostNeeded).to.equal(0);
  });

  it("Should correctly report awakening path for Setswana (Tribe 4)", async function () {
    const path = await humanFactory.getAwakeningPath(4);
    expect(path.baseFreq).to.equal(45);
    expect(path.boostNeeded).to.equal(43);
  });

  it("Should correctly report awakening path for Sepedi (Tribe 5)", async function () {
    const path = await humanFactory.getAwakeningPath(5);
    expect(path.baseFreq).to.equal(38);
    expect(path.boostNeeded).to.equal(50);
  });

  it("Should correctly identify Synthesis path for Tribe 12", async function () {
    const path = await humanFactory.getAwakeningPath(12);
    expect(path.baseFreq).to.equal(44);
    expect(path.boostNeeded).to.equal(0);
  });

  it("Should verify emergencyFoundationRepair function exists", async function () {
    expect(humanFactory.emergencyFoundationRepair).to.exist;
  });
});
