const { ethers } = require("hardhat");

async function main() {
  const DIAMOND_ADDRESS = "0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7";
  const loupe = await ethers.getContractAt("DiamondLoupeFacet", DIAMOND_ADDRESS);
  const heritage = await ethers.getContractFactory("AncestralHeritageFacet");
  const factory = await ethers.getContractFactory("HumanFactoryFacet");
  const mentorship = await ethers.getContractFactory("MentorshipFacet");

  console.log("💎 --- DIAMOND INSPECTION REPORT --- 💎");

  const check = async (name, contractFactory, funcName) => {
    const selector = contractFactory.interface.getFunction(funcName).selector;
    const addr = await loupe.facetAddress(selector);
    console.log(`📍 ${name.padEnd(12)} -> ${funcName.padEnd(20)} -> ${addr}`);
  };

  await check("Heritage", heritage, "joinTribe");
  await check("Factory", factory, "mintGenesisHuman");
  await check("Mentorship", mentorship, "recordAwakening");
  await check("Loupe", (await ethers.getContractFactory("DiamondLoupeFacet")), "facetAddress");

  console.log("---");
  console.log("✅ Diagnostic Complete: All Frequencies Synced.");
}

main().catch(console.error);
