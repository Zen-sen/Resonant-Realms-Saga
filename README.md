# Resonant Realms Saga: White-Label-Trust-Node

## 🌌 The Vision
A tamper-evident hardware-to-blockchain rewards system. The first implementation is **TrustBunnies**, an ancestral Match-3 and breeding game on the Pi Network.

## 🏗️ Architecture: EIP-2535 Diamond Standard
We use the Diamond Standard for infinite modularity and to bypass the 24KB contract limit.
- **Diamond.sol**: The central proxy (The Prism).
- **LibAppStorage.sol**: Unified state (The Ancestral Memory).
- **Facets**: Modular logic (AncestralHeritage, BunnyFactory, Mentorship).

## 🛠️ Tech Stack
- **Framework**: Hardhat / TypeScript
- **Solidity**: 0.8.20 (Paris EVM)
- **Memory**: AppStorage Pattern
- **Chain ID**: 31337 (Local) / Pi Network (Target)

## 🚀 Getting Started
1. `npm install`
2. `npx hardhat compile`
3. `npx hardhat test`
