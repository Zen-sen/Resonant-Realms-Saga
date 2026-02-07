// Hardhat Blueprint: Genesis Breathing Test
const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  
  // We attach to the BunnyFactoryFacet logic through the Diamond Proxy
  const bunnyFactory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);

  console.log("--- Genesis Breathing Test ---");
  console.log("Calling Ancestral Plane at:", DIAMOND_ADDRESS);
  console.log("Birthing Bunny #0: ǃKaggen (Khoe-San Foundation)...");

  try {
    const tx = await bunnyFactory.mintBunny(0); // 0 = Khoe-San / First Nations
    const receipt = await tx.wait();
    
    console.log("SUCCESS: ǃKaggen has manifested.");
    console.log("Transaction Hash:", receipt.hash);
    console.log("Status: Foundation Active (Index 0).");
  } catch (error) {
    console.error("FAILURE: The Ancestral Plane rejected the minting.");
    console.error(error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});