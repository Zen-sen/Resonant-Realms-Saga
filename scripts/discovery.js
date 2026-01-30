const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf";
  
  // Create an interface for AncestralHeritageFacet
  const iface = new ethers.Interface([
    "function joinTribe(uint256 _tribeId)",
    "function getPlayerStats(address _player)"
  ]);

  console.log("🔍 Hex Discovery:");
  console.log("joinTribe selector:", iface.getFunction("joinTribe").selector);
  console.log("getPlayerStats selector:", iface.getFunction("getPlayerStats").selector);

  const diamond = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);
  
  // Checking the contract owner to see if storage is even working
  try {
    const owner = await ethers.provider.getStorage(DIAMOND_ADDRESS, "0x0000000000000000000000000000000000000000000000000000000000000000");
    console.log("📍 Slot 0 Value:", owner);
  } catch (e) {
    console.log("Slot 0 unreachable");
  }
}

main().catch(console.error);