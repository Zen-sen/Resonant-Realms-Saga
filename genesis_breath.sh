#!/bin/bash

# Resonant Realms Forge - Genesis Breathing Test
# Targeting the Diamond Stone at 0xB7f8...4F5e

DIAMOND_ADDRESS="0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e"
RPC_URL="http://127.0.0.1:8545"

echo "🔥 Initiating Genesis Breathing Test..."
echo "🐇 Minting Bunny #0: ǃKaggen (Khoe-San Foundation)..."

# Calling the hardhat task/script
npx hardhat run scripts/mint_kaggen.js --network localhost

echo "✨ Genesis Breath Complete. Check the Diamond Loupe for Bunny #0."
