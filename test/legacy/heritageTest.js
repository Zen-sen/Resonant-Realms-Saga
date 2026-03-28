const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Resonant Realms: Heritage & Synthesis Logic", function () {
  let heritageFacet, antigravityFacet;
  let owner, player1, player2;

  /**
   * @dev Extracts all function selectors from a contract's ABI.
   */
  function getSelectors(contract) {
    const selectors = [];
    contract.interface.forEachFunction((fn) => {
      selectors.push(fn.selector);
    });
    return selectors;
  }

  before(async function () {
    [owner, player1, player2] = await ethers.getSigners();

    // 1. Deploy the Diamond Proxy — sets deployer as contractOwner
    const Diamond = await ethers.getContractFactory("Diamond");
    const diamond = await Diamond.deploy(owner.address);
    const diamondAddress = await diamond.getAddress();

    // 2. Deploy AncestralHeritageFacet logic contract
    const HeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
    const heritageDeploy = await HeritageFacet.deploy();
    const heritageAddress = await heritageDeploy.getAddress();
    const heritageSelectors = getSelectors(heritageDeploy);

    // 3. Inscribe heritage selectors into Diamond
    await diamond.setFacetsBatch(heritageAddress, heritageSelectors);

    // 4. Deploy AntigravityFacet logic contract
    const AntigravityFacet = await ethers.getContractFactory("AntigravityFacet");
    const antigravityDeploy = await AntigravityFacet.deploy();
    const antigravityAddress = await antigravityDeploy.getAddress();
    const antigravitySelectors = getSelectors(antigravityDeploy);

    // 5. Inscribe antigravity selectors into Diamond
    await diamond.setFacetsBatch(antigravityAddress, antigravitySelectors);

    // 6. Interface through Diamond proxy
    heritageFacet = await ethers.getContractAt("AncestralHeritageFacet", diamondAddress);
    antigravityFacet = await ethers.getContractAt("AntigravityFacet", diamondAddress);

    // 7. Initialize all 13 tribes (owner == contractOwner)
    await heritageFacet.connect(owner).initializeTribalMatrix();
  });

  it("Should prevent joining Khoe-San (Tribe 0) without Genesis Experiment", async function () {
    await expect(
      heritageFacet.connect(player1).joinTribe(0)
    ).to.be.revertedWith("Khoe-San requires Genesis Experiment (30%+ lift)");
  });

  it("Should allow a player to join an active tribe (Zulu - Tribe 1)", async function () {
    await heritageFacet.connect(player1).joinTribe(1);
    const stats = await heritageFacet.getPlayerStats(player1.address);
    expect(stats.tribeId).to.equal(1);
  });

  it("Should allow tribe switching (no lock-in rule)", async function () {
    await heritageFacet.connect(player2).joinTribe(1);
    let stats = await heritageFacet.getPlayerStats(player2.address);
    expect(stats.tribeId).to.equal(1);

    await heritageFacet.connect(player2).joinTribe(2);
    stats = await heritageFacet.getPlayerStats(player2.address);
    expect(stats.tribeId).to.equal(2);
  });

  it("Should prevent non-Synthesis players from using selectSynthesisBuff", async function () {
    await expect(
      heritageFacet.connect(player1).selectSynthesisBuff(5)
    ).to.be.revertedWith("Only Synthesis tribe can bridge");
  });

  it("Should verify all 13 tribes are active after initialization", async function () {
    for (let i = 0; i <= 12; i++) {
      const tribe = await heritageFacet.getTribe(i);
      expect(tribe.isActive).to.be.true;
      expect(tribe.name.length).to.be.greaterThan(0);
    }
  });
});