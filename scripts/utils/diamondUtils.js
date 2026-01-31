// EIP-2535 Diamond Standard Utilities
const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };

function getSelectors(contract) {
  const signatures = Object.keys(contract.interface.functions);
  const selectors = signatures.map(sig => {
    return contract.interface.getSighash(sig);
  });
  return selectors;
}

module.exports = { getSelectors, FacetCutAction };
