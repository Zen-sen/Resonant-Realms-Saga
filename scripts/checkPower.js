const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  const factory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);

  console.log("🧐 Calculating Power Levels of the Bloodline...");

  try {
    const p0 = await factory.getBunnyPower(0);
    const p1 = await factory.getBunnyPower(1);

    console.log("---");
    console.log("🐰 Bunny #0 Power:", p0.toString());
    console.log("🐰 Bunny #1 Power:", p1.toString());
    console.log("---");
    
    if (BigInt(p1) > BigInt(p0)) {
        console.log("🚀 EVOLUTION CONFIRMED: Bunny #1 is stronger!");
    }
  } catch (error) {
    console.error("❌ Error fetching power:", error.reason || error.message);
  }
}

main().catch(console.error);
