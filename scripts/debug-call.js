const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x525C7063E7C20997BaaE9bDa922159152D0e8417";
  const [deployer] = await ethers.getSigners();
  
  // Directly calling the signature to see the raw revert
  const data = ethers.id("getBunny(uint256)").substring(0, 10);
  console.log("Calling selector:", data);
  
  try {
    const result = await deployer.call({
      to: diamondAddress,
      data: data + "0000000000000000000000000000000000000000000000000000000000000000" // Bunny #0
    });
    console.log("Raw Result:", result);
  } catch (e) {
    console.log("Error Message:", e.message);
  }
}

main().catch(console.error);
