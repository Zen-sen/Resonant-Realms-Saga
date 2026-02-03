const { ethers } = require("hardhat");

async function main() {
  const address = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  console.log("Checking the Pulse of Diamond at:", address);
  
  try {
    const code = await ethers.provider.getCode(address);
    if (code === "0x" || code === "0x0") {
      console.log("❌ Result: No contract found at this address on your current node.");
    } else {
      console.log("✅ Result: Diamond Stone found! Bytecode length:", code.length);
    }
  } catch (error) {
    console.error("❌ Error: Could not connect to the node. Is 'npx hardhat node' running in another window?");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
