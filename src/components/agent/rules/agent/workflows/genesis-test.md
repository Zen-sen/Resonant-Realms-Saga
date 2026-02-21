# Workflow: Genesis Breathing Test
# Trigger: /genesis-test

1. **Verify Environment:** Check if the current provider is connected to the Active Diamond at `0xB7f8BC63...`.
2. **Pre-Flight:** Run `npx hardhat verify-storage` to ensure no namespace collisions in `LibAppStorage`.
3. **Minting Logic:** Execute the `BunnyFactory.sol` script to mint Bunny #0 (ǃKaggen).
4. **Validation:** Verify the passive buff logic follows the "Bridge" nature (selecting one passive buff from any of the first 11 tribes).
5. **Artifact:** Generate a "Victory Report" comparing progress to our last saved state.