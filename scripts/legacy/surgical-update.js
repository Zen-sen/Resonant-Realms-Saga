const { ethers } = require("hardhat");

async function main() {
  const diamondAddress = "0x95401dc811bb5740090279Ba06cfA8fcF6113778"; 
  const facetAddress = "0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf";
  const [owner] = await ethers.getSigners();

  console.log("⚔️ Initiating Surgical Update on Stone:", diamondAddress);

  const diamondCut = await ethers.getContractAt(
    "contracts/interfaces/IDiamondCut.sol:IDiamondCut", 
    diamondAddress
  );

  // The functions the Stone is currently "forgetting"
  const selectors = [
    ethers.id("getHumanCount()").substring(0, 10),
    ethers.id("getHumanPower(uint256)").substring(0, 10)
  ];

  const cut = [{
    facetAddress: facetAddress,
    action: 0, // 0 = Add
    functionSelectors: selectors
  }];

  try {
    const tx = await diamondCut.diamondCut(cut, ethers.ZeroAddress, "0x");
    await tx.wait();
    console.log("✨ SUCCESS: The Stone now recognizes getHumanCount and getHumanPower.");
  } catch (error) {
    if (error.message.includes("already exists")) {
      console.log("🔄 Selectors exist but might point to old logic. Replacing...");
      const replaceCut = [{
        facetAddress: facetAddress,
        action: 1, // 1 = Replace
        functionSelectors: selectors
      }];
      const tx = await diamondCut.diamondCut(replaceCut, ethers.ZeroAddress, "0x");
      await tx.wait();
      console.log("✨ SUCCESS: The Stone has been REPLACED with new wisdom.");
    } else {
      console.error("❌ Surgical Cut Failed:", error.message);
    }
  }
}

main().catch(console.error);
