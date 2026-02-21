# Workflow: Genesis Sync
# Trigger: /genesis-sync
1. Run `npx hardhat node` in a background terminal.
2. Deploy Diamond: Run `scripts/inscribe-breed.js`.
3. Reset Frontend: Update `LifterExperiment.tsx` with the new Diamond Address.
4. Clean MetaMask: Remind user to "Reset Account" if nonce errors occur.