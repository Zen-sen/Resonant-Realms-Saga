const { ethers } = require("hardhat");

async function main() {
  // Use the LATEST Diamond address from your terminal
  const DIAMOND_ADDRESS = "0x9E545E3C0baAB3E08CdfD552C960A1050f373042";
  const [admin] = await ethers.getSigners();

  console.log("🧐 Probing the Diamond's Mind at:", DIAMOND_ADDRESS);
  
  // Create a contract instance for the Diamond
  const diamond = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);

  try {
    // 1. We attempt to reach the facet through the Diamond Stone
    console.log("📡 Testing delegation to AncestralHeritageFacet...");
    const heritage = await ethers.getContractAt("AncestralHeritageFacet", DIAMOND_ADDRESS);
    
    // Attempting a 'view' call (it doesn't cost gas and is safer for debugging)
    const stats = await heritage.getPlayerStats(admin.address);
    console.log("✨ SUCCESS! The Stone recognizes the Logic.");
    console.log("📊 Stats retrieved:", stats.toString());
  } catch (error) {
    console.log("❌ REVEAL: The Diamond is still blind to this function.");
    console.log("Internal Error:", error.message);
    
    console.log("\n🧪 GURU DIAGNOSIS:");
    console.log("If you see 'Function does not exist', we MUST run 'npx hardhat clean' and re-deploy.");
    console.log("The Diamond.sol needs to be re-compiled to ensure it's using the Hashed Storage Slot.");
  }
}

main().catch(console.error);
