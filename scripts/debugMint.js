const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  const [player] = await ethers.getSigners();
  const factory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);

  console.log("🧐 Running Diagnostic Mint...");
  
  try {
    const tx = await factory.mintNextGeneration(4096);
    console.log("🛰️ Transaction Sent. Hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Transaction Mined in block:", receipt.blockNumber);
    
    const count = await ethers.provider.getStorage(DIAMOND_ADDRESS, ethers.keccak256(ethers.toUtf8Bytes("resonantrealms.storage.main")));
    console.log("📊 Raw Storage Position Probe successful.");
  } catch (error) {
    console.error("❌ MINT FAILED:", error.reason || error.message);
  }
}

main().catch(console.error);
