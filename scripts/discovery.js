const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 DIAMOND DISCOVERY ROUTINE");
  console.log("=".repeat(60));

  // Common Hardhat deterministic addresses
  const candidates = [
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    "0xDc64a130ad222B197c171b23D263c446d68f26a5",
    "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    "0xB7f8BC676941091ca24E1955367639537f225D00",
    "0x5081a39b8A5f0E35a8D959395a630b68B74Dd30f"
  ];

  for (let addr of candidates) {
    addr = addr.toLowerCase();
    console.log(`\nChecking ${addr}...`);
    const code = await ethers.provider.getCode(addr);
    if (code === "0x") {
      console.log("  ❌ No code at this address.");
      continue;
    }

    try {
      const loupe = await ethers.getContractAt("DiamondLoupeFacet", addr);
      const facets = await loupe.facetAddresses();
      console.log(`  💎 FOUND! Diamond active with ${facets.length} facets.`);
      facets.forEach((f, i) => console.log(`    [${i}] ${f}`));

      // Try to find factory
      const factory = await ethers.getContractAt("BunnyFactoryFacet", addr);
      try {
        const count = await factory.totalSages();
        console.log(`    📊 BunnyCount: ${count}`);
      } catch (e) {
        console.log("    ⚠️ BunnyFactory selectors not found on this Diamond.");
      }
    } catch (e) {
      console.log(`  ❌ Not a Diamond Loupe or call reverted: ${e.message.split('\n')[0]}`);
    }
  }
}

main().catch(console.error);