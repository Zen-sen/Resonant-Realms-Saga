const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  const [architect, newcomer] = await ethers.getSigners();
  const gifting = await ethers.getContractAt("UbuntuGiftingFacet", DIAMOND_ADDRESS);
  const factory = await ethers.getContractAt("BunnyFactoryFacet", DIAMOND_ADDRESS);
  const mentorship = await ethers.getContractAt("MentorshipFacet", DIAMOND_ADDRESS);

  console.log("🌊 Testing the State of Flow...");

  await mentorship.recordAwakening(1000); 
  console.log("🎁 Architect gifting points to awaken the Khoe-San tribe...");
  await gifting.giftResonance(newcomer.address, 950);

  const status = await gifting.getTribeResonance(0);
  console.log("📊 Tribe 0 Pool:", status.current.toString(), "/", status.threshold.toString());
  console.log("✨ Awakened Status:", status.isAwakened);

  console.log("🤱 Newcomer minting Bunny #2...");
  const balanceBefore = await mentorship.getUbuntuPoints(newcomer.address);
  
  const tx = await factory.connect(newcomer).mintNextGeneration(0);
  await tx.wait();
  
  const balanceAfter = await mentorship.getUbuntuPoints(newcomer.address);
  const spent = BigInt(balanceBefore) - BigInt(balanceAfter);

  console.log("---");
  console.log("💰 Points Spent:", spent.toString());
  if (spent === BigInt(800)) {
    console.log("✅ SUCCESS: State of Flow 20% discount applied!");
  } else {
    console.log("❌ FAIL: Expected 800, but spent", spent.toString());
  }
  console.log("---");
}

main().catch(console.error);
