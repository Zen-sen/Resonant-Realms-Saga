const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  const networkInfo = await hre.ethers.provider.getNetwork();
  const chainId = networkInfo.chainId.toString();
  
  const networkName = 
    chainId === "31337" ? "localhost" :
    chainId === "80002" ? "polygon_amoy" :
    chainId === "80001" ? "polygon_mumbai" :
    chainId === "31415" ? "pi_testnet" : `chain_${chainId}`;
  
  console.log("═══════════════════════════════════════════════════════════");
  console.log("   RESONANT REALMS SAGA - DIAMOND DEPLOYMENT RITUAL v1.4.1");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`\n⛏️  Forging on: ${networkName} (Chain ID: ${chainId})`);
  console.log(`👤 Architect: ${deployer.address}`);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ETH\n`);

  console.log("📦 PHASE 1: Deploying Diamond Core...");

  const Diamond = await hre.ethers.getContractFactory("Diamond");
  const DiamondCutFacet = await hre.ethers.getContractFactory("DiamondCutFacet");
  
  const diamondCutFacet = await DiamondCutFacet.deploy();
  await diamondCutFacet.waitForDeployment();
  const diamondCutFacetAddr = await diamondCutFacet.getAddress();
  console.log(`   ✅ DiamondCutFacet: ${diamondCutFacetAddr}`);

  const diamond = await Diamond.deploy(deployer.address);
  await diamond.waitForDeployment();
  const diamondAddress = await diamond.getAddress();
  console.log(`   ✅ Diamond Core: ${diamondAddress}`);

  console.log("\n📦 PHASE 2: Deploying Facets...");

  const facetNames = [
    "BunnyFactoryFacet", "HumanFactoryFacet", "BreedingFacet",
    "GravityFacet", "AntigravityFacet", "ResonanceFacet",
    "AncestralHeritageFacet", "AncestralRelicFacet", "PiPaymentFacet",
    "KycVerificationFacet", "UbuntuPointsFacet", "UbuntuGiftingFacet",
    "MentorshipFacet", "GameOracleFacet", "DiamondLoupeFacet",
  ];

  const deployedFacets = {};

  for (const facetName of facetNames) {
    try {
      const factory = await hre.ethers.getContractFactory(facetName);
      const facet = await factory.deploy();
      await facet.waitForDeployment();
      const addr = await facet.getAddress();
      deployedFacets[facetName] = addr;
      console.log(`   ✅ ${facetName}`);
    } catch (error) {
      console.log(`   ⚠️  ${facetName}: Skipped`);
    }
  }

  console.log("\n📦 PHASE 3: Initializing Core Systems...");

  if (deployedFacets["GravityFacet"]) {
    try {
      const gravityFacet = await hre.ethers.getContractAt("GravityFacet", diamondAddress);
      for (let i = 0; i <= 12; i++) {
        await (await gravityFacet.syncTribePhysics(i)).wait();
      }
      console.log("   ✅ 13 Tribes initialized");
    } catch (e) {
      console.log("   ⚠️  Tribe sync: Skipped");
    }
  }

  console.log("\n" + "═".repeat(64));
  console.log("   ✨ DEPLOYMENT COMPLETE ✨");
  console.log("═".repeat(64));
  console.log(`\n📍 Diamond: ${diamondAddress}`);
  
  const explorer = chainId === "31337" ? "localhost" :
    chainId === "80002" ? "https://www.oklink.com/amoy" :
    chainId === "80001" ? "https://mumbai.polygonscan.com" :
    "https://explorer.pi.network";
  console.log(`🔗 Explorer: ${explorer}/address/${diamondAddress}`);
  console.log("\n📋 Facets:");
  for (const [name, addr] of Object.entries(deployedFacets)) {
    console.log(`   • ${name}`);
  }

  const fs = require("fs");
  const path = require("path");
  
  const deploymentData = {
    network: networkName, chainId, diamondAddress,
    deployer: deployer.address, facets: deployedFacets,
    timestamp: new Date().toISOString()
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) fs.mkdirSync(deploymentsDir, { recursive: true });
  
  fs.writeFileSync(
    path.join(deploymentsDir, `${networkName}-deployment.json`),
    JSON.stringify(deploymentData, null, 2)
  );
  console.log(`\n💾 Saved to deployments/${networkName}-deployment.json`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
