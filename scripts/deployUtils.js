const hre = require("hardhat");

async function main() {
  const AncestralUtils = await hre.ethers.getContractFactory("AncestralUtils");
  const utils = await AncestralUtils.deploy();
  await utils.waitForDeployment();
  
  const address = await utils.getAddress();
  console.log("Utils Deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
