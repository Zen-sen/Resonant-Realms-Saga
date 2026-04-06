import { BrowserProvider, Contract, JsonRpcSigner } from 'ethers';
import { CONTRACT_CONFIG } from '../config/contracts';

export interface ContractBindings {
  gravity: Contract | null;
  antigravity: Contract | null;
  resonance: Contract | null;
  bunnyFactory: Contract | null;
  piPayment: Contract | null;
}

export function getContractBindings(signer: JsonRpcSigner): ContractBindings {
  const diamond = CONTRACT_CONFIG.diamondAddress;
  
  return {
    gravity: new Contract(diamond, [
      'function syncTribePhysics(uint256 _tribeId) external',
      'function updatePhysicalState(uint256 _bunnyId, int256 _x, int256 _y, bool _floating) external',
      'function getPhysicalState(uint256 _bunnyId) external view returns (tuple(int256 x, int256 y, int256 velocityY, bool isFloating))',
    ], signer),
    
    antigravity: new Contract(diamond, [
      'function recordExperiment(uint256 _liftPercent, uint256 _peakVoltage, bytes32 _telemetryHash, string calldata _metadataURI, uint256 _adversaryBuffer) external',
      'function hasPassedThreshold(address _player) external view returns (bool)',
      'function getExperimentData(address _player) external view returns (uint256, uint256, bytes32, uint256, string memory, uint256)',
      'function getThreshold() external pure returns (uint256)',
    ], signer),
    
    resonance: new Contract(diamond, [
      'function recordResonance(uint256 _bunnyId, uint256 _score, uint256 _duration) external',
      'function recordFailure(uint256 _forgeFailure, uint256 _mindJitter) external',
      'function updateEntityPhysics(uint256 _bunnyId, int256 _x, int256 _y, bool _isFloating) external',
    ], signer),
    
    bunnyFactory: new Contract(diamond, [
      'function createGenesisBunny(address _owner) external returns (uint256)',
      'function breedBunnies(uint256 _matronId, uint256 _sireId) external returns (uint256)',
      'function getBunny(uint256 _bunnyId) external view returns (tuple(uint256 genes, uint256 birthTime, uint256 tribeId, uint256 generation, uint256 resonance, uint256 matronId, uint256 sireId, uint256 cooldownEnd))',
    ], signer),
    
    piPayment: new Contract(diamond, [
      'function processPiPayment(bytes32 _paymentId, uint256 _amount, string calldata _metadataURI) external',
      'function claimRewards(bytes32 _paymentId) external',
      'function getPayment(bytes32 _paymentId) external view returns (tuple(bytes32 paymentId, address payer, uint256 amount, uint256 timestamp, bool claimed, string metadataURI))',
    ], signer),
  };
}

export async function getReadOnlyContract() {
  const provider = new BrowserProvider(window.ethereum!);
  return getContractBindings(await provider.getSigner());
}
