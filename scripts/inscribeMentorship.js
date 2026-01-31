const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  
  console.log("🏺 Deploying Mentorship Facet...");
  const Mentorship = await ethers.getContractFactory("MentorshipFacet");
  const mentorship = await Mentorship.deploy();
  await mentorship.waitForDeployment();
  const mentorshipAddress = await mentorship.getAddress();
  
  console.log("⚔️ Inscribing Mentorship into the Stone at:", mentorshipAddress);
  
  const stone = await ethers.getContractAt("Diamond", DIAMOND_ADDRESS);
  const selectors = [
    Mentorship.interface.getFunction("recordAwakening").selector,
    Mentorship.interface.getFunction("getUbuntuPoints").selector
  ];

  const tx = await stone.setFacetsBatch(mentorshipAddress, selectors);
  await tx.wait();

  console.log("✨ SUCCESS: The Stone now understands Ubuntu Resonance.");
}

main().catch(console.error);
