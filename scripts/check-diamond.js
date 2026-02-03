const { ethers } = require("hardhat");

async function main() {
  const address = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
  console.log("Checking the Pulse of Diamond at:", address);
  
  const code = await ethers.provider.getCode(address);
  
  if (code === "0x") {
    console.log("❌ Result: No contract found. This address is empty.");
  } else {
    console.log("✅ Result: Contract found! Bytecode length:", code.length);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});