const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Resonant Realms: Heritage & Synthesis Logic", function () {
  let heritageFacet;
  let owner, player1, player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();

    // 1. Deploy the Facet directly for the test
    const HeritageFacet = await ethers.getContractFactory("AncestralHeritageFacet");
    heritageFacet = await HeritageFacet.deploy();
    
    // In Ethers v6, we wait for deployment like this:
    await heritageFacet.waitForDeployment();
  });

  it("Should allow a player to join the Khoe-San (Tribe ID: 0)", async function () {
    await heritageFacet.connect(player1).joinTribe(0);
    
    const stats = await heritageFacet.getPlayerStats(player1.address);
    // Ethers v6 uses BigInt (0n) for uint256
    expect(stats.tribe).to.equal(0n); 
  });

  it("Should prevent a player from joining a second tribe", async function () {
    await heritageFacet.connect(player1).joinTribe(0);
    await expect(
      heritageFacet.connect(player1).joinTribe(1)
    ).to.be.revertedWith("You already belong to a tribe");
  });

  it("Should allow Synthesis (Tribe 11) to bridge to Khoe-San (Tribe 0) buff", async function () {
    await heritageFacet.connect(player2).joinTribe(11);
    await heritageFacet.connect(player2).selectSynthesisBridge(0);
    
    const stats = await heritageFacet.getPlayerStats(player2.address);
    expect(stats.tribe).to.equal(11n);
    expect(stats.activeBuff).to.equal(0n);
  });

  it("Should prevent non-Synthesis players from using the bridge", async function () {
    await heritageFacet.connect(player1).joinTribe(0);
    await expect(
      heritageFacet.connect(player1).selectSynthesisBridge(5)
    ).to.be.revertedWith("Must be Synthesis Tribe");
  });
});