import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("⚒️  Forging the Resonant Realms...");

  // 1. Deploy Diamond
  const Diamond = await ethers.getContractFactory("Diamond");
  const diamond = await Diamond.deploy(deployer.address);
  await diamond.waitForDeployment();
  const diamondAddr = await diamond.getAddress();

  // 2. Deploy BunnyFactoryFacet
  const BunnyFactory = await ethers.getContractFactory("BunnyFactoryFacet");
  const bunnyFacet = await BunnyFactory.deploy();
  await bunnyFacet.waitForDeployment();
  const bunnyFacetAddr = await bunnyFacet.getAddress();

  // 3. The Sacred Union: Linking breedBunnies to the Diamond
  const selector = BunnyFactory.interface.getFunction("breedBunnies")?.selector;
  
  const tx = await diamond.setFacet(selector!, bunnyFacetAddr);
  await tx.wait();

  console.log("💎 Diamond Hub:", diamondAddr);
  console.log("🐰 Bunny Logic Cut into Diamond successfully!");
  console.log("✨ You can now call breedBunnies() through the Diamond address.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
