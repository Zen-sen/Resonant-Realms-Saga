const hre = require("hardhat");

async function main() {
  const diamondAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  const [owner] = await hre.ethers.getSigners();
  const bunnyFactory = await hre.ethers.getContractAt("BunnyFactoryFacet", diamondAddress);

  console.log("🔥 Breathing life into ǃKaggen (Bunny #0)...");
  
  const genes = 0; 
  
  try {
    const tx = await bunnyFactory.createGenesisBunny(genes, owner.address); 
    await tx.wait();
    console.log(`✅ SUCCESS! ǃKaggen has manifested in the Realms.`);
    console.log(`Transaction Hash: ${tx.hash}`);
  } catch (error) {
    console.error("❌ Minting failed:", error.reason || error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
