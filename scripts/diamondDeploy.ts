import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const networkName = network.name;
  
  console.log("═══════════════════════════════════════════════════════════");
  console.log("   RESONANT REALMS SAGA - DIAMOND DEPLOYMENT RITUAL v1.4.1");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`\n⛏️  Forging on: ${networkName}`);
  console.log(`👤 Architect: ${deployer.address}`);
  console.log(`💰 Balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH\n`);

  // PHASE 1: Deploy Diamond Core
  console.log("📦 PHASE 1: Deploying Diamond Core...");

  const Diamond = await ethers.getContractFactory("Diamond");
  const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
  
  const diamondCutFacet = await DiamondCutFacet.deploy();
  await diamondCutFacet.waitForDeployment();
  const diamondCutFacetAddr = await diamondCutFacet.getAddress();
  console.log(`   ✅ DiamondCutFacet deployed: ${diamondCutFacetAddr}`);

  const diamond = await Diamond.deploy(deployer.address);
  await diamond.waitForDeployment();
  const diamondAddress = await diamond.getAddress();
  console.log(`   ✅ Diamond Core forged: ${diamondAddress}`);

  // PHASE 2: Deploy All Facets
  console.log("\n📦 PHASE 2: Forging Facets...");

  const facetNames = [
    "BunnyFactoryFacet",
    "HumanFactoryFacet",
    "BreedingFacet",
    "GravityFacet",
    "AntigravityFacet",
    "ResonanceFacet",
    "AncestralHeritageFacet",
    "AncestralRelicFacet",
    "PiPaymentFacet",
    "KycVerificationFacet",
    "UbuntuPointsFacet",
    "UbuntuGiftingFacet",
    "MentorshipFacet",
    "GameOracleFacet",
    "DiamondLoupeFacet",
  ];

  const deployedFacets: Record<string, string> = {};

  for (const facetName of facetNames) {
    try {
      const factory = await ethers.getContractFactory(facetName);
      const facet = await factory.deploy();
      await facet.waitForDeployment();
      const addr = await facet.getAddress();
      deployedFacets[facetName] = addr;
      console.log(`   ✅ ${facetName}: ${addr}`);
    } catch (error: any) {
      console.log(`   ⚠️  ${facetName}: Skipped (${error.message?.slice(0, 40) || "deployment error"})`);
    }
  }

  // PHASE 3: Link Facets to Diamond using setFacetsBatch
  console.log("\n📦 PHASE 3: Inscribing Facets into Diamond...");

  const diamondWithCut = diamond.connect(deployer);
  
  for (const [facetName, facetAddress] of Object.entries(deployedFacets)) {
    try {
      const facetFactory = await ethers.getContractFactory(facetName);
      const facetInterface = facetFactory.interface;
      
      const selectors: string[] = [];
      const functionFragments = Object.values(facetInterface.functions) as any[];
      
      for (const func of functionFragments) {
        if (func.name && func.name !== "constructor" && !func.name.startsWith("get") && !func.name.startsWith("supportsInterface")) {
          try {
            selectors.push(facetInterface.getFunction(func.name).selector);
          } catch {
            // Skip if selector extraction fails
          }
        }
      }

      if (selectors.length > 0) {
        const tx = await diamondWithCut.setFacetsBatch(facetAddress, selectors);
        await tx.wait();
        console.log(`   ✅ ${facetName}: ${selectors.length} functions inscribed`);
      }
    } catch (error: any) {
      console.log(`   ⚠️  ${facetName}: ${error.message?.slice(0, 50) || "Error"}`);
    }
  }

  // PHASE 4: Initialize Core Systems
  console.log("\n📦 PHASE 4: Initializing Core Systems...");

  if (deployedFacets["GravityFacet"]) {
    try {
      const gravityFacet = await ethers.getContractAt(
        "GravityFacet",
        diamondAddress
      );
      for (let i = 0; i <= 12; i++) {
        const tx = await gravityFacet.syncTribePhysics(i);
        await tx.wait();
      }
      console.log("   ✅ 13 Tribes initialized with physics profiles");
    } catch (error) {
      console.log("   ⚠️  Tribe sync: Already initialized or skipped");
    }
  }

  if (deployedFacets["PiPaymentFacet"]) {
    console.log("   ✅ Pi Payment Facet ready");
  }

  // DEPLOYMENT SUMMARY
  console.log("\n" + "═".repeat(64));
  console.log("   ✨ DIAMOND DEPLOYMENT COMPLETE ✨");
  console.log("═".repeat(64));
  console.log(`\n📍 Diamond Address: ${diamondAddress}`);
  console.log(`🔗 Explorer: https://${networkName === "pi_testnet" ? "rpc-testnet" : networkName}.explorer${networkName === "mainnet" ? ".pi" : ".network"}/address/${diamondAddress}`);
  console.log("\n📋 Deployed Facets:");
  for (const [name, addr] of Object.entries(deployedFacets)) {
    console.log(`   • ${name}: ${addr}`);
  }
  console.log("\n📝 Frontend Config:");
  console.log(`\nexport const CONTRACT_CONFIG = {\n  diamondAddress: "${diamondAddress}",\n  network: "${networkName}",\n  chainId: ${(await ethers.provider.getNetwork()).chainId}\n};`);

  // SAVE DEPLOYMENT ARTIFACTS
  const fs = require("fs");
  const path = require("path");
  
  const deploymentData = {
    network: networkName,
    timestamp: new Date().toISOString(),
    diamondAddress,
    deployer: deployer.address,
    facets: deployedFacets,
    chainId: (await ethers.provider.getNetwork()).chainId.toString()
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${networkName}-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2));
  console.log(`\n💾 Deployment saved to: ${deploymentFile}`);
}

main()
  .then(() => {
    console.log("\n🎉 The Resonant Realms Diamond Stone is forged!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });
