module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying the Resonant Realms Diamond with the account:", deployer.address);

  // 1. Deploy the DiamondCutFacet (The Sculptor's Hand)
  const DiamondCutFacet = await ethers.getContractFactory("DiamondCutFacet");
  const cutFacet = await DiamondCutFacet.deploy();
  await cutFacet.waitForDeployment();
  console.log("DiamondCutFacet deployed to:", await cutFacet.getAddress());

  // 2. Deploy the Diamond Stone (The Proxy Hub)
  const Diamond = await ethers.getContractFactory("Diamond");
  const diamond = await Diamond.deploy(deployer.address, await cutFacet.getAddress());
  await diamond.waitForDeployment();
  const diamondAddress = await diamond.getAddress();
  console.log("Diamond Stone (Proxy) deployed to:", diamondAddress);

  console.log("\n--- Birth Ritual Complete ---");
  console.log("The Diamond is now ready to receive its Ancestral Facets.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
