const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  const factory = await ethers.getContractAt("HumanFactoryFacet", DIAMOND_ADDRESS);

  console.log("--- Genesis Awakening Test ---");
  console.log("Targeting Diamond at:", DIAMOND_ADDRESS);
  console.log("Awakening ID #0: ǃKaggen (Khoe-San Foundation)...");

  try {
    // We update the call to match 'awakenHuman' found in the contract
    const tx = await factory.awakenHuman(0); 

    console.log("Waiting for block confirmation...");
    const receipt = await tx.wait();

    console.log("SUCCESS: ǃKaggen has manifested in the Resonant Realms.");
    console.log("Transaction Hash:", receipt.hash);
    console.log("Status: Foundation Active (Index 0).");
  } catch (error) {
    console.error("FAILURE: The Forge rejected the awakening.");
    console.error("Reason:", error.message);
    
    console.log("\n[Guru Tip]: If it says 'reverted', we might need to mint the vessel first.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
