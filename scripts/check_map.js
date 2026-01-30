const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x809d550fca64d94Bd9F66E60752A544199cfAC3D";
  const [admin] = await ethers.getSigners();

  // The selector for joinTribe(uint256)
  const selector = "0x30663456"; 

  console.log("🧐 Reading Diamond Storage directly...");
  
  // This calculates the exact storage slot for the selector inside the mapping
  // based on your STORAGE_SLOT = keccak256("diamond.standard.resonant.realms")
  const baseSlot = ethers.keccak256(ethers.toUtf8Bytes("diamond.standard.resonant.realms"));
  
  // In Solidity, mapping(bytes4 => address) selectorToFacet is the 2nd item (index 1)
  // We check if anything is registered there.
  const mappingSlot = ethers.toBeHex(BigInt(baseSlot) + 1n); 
  
  const value = await ethers.provider.getStorage(DIAMOND_ADDRESS, mappingSlot);
  console.log("📍 Mapping Base Slot Value:", value);
  
  if (value === "0x" + "0".repeat(64)) {
    console.log("❌ The Diamond's map is EMPTY. The deploy script didn't write to the Hashed Slot.");
  } else {
    console.log("✅ Data found in Hashed Slot!");
  }
}

main().catch(console.error);