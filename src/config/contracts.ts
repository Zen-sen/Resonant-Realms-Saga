// Polygon Amoy (Testnet)
export const CONTRACT_CONFIG = {
  diamondAddress: '0x0000000000000000000000000000000000000000',
  network: 'polygon_amoy',
  chainId: 80002,
  rpcUrl: 'https://rpc-amoy.polygon.technology',
  blockExplorer: 'https://amoy.polygonscan.com',
};

export const NETWORKS = {
  polygon_amoy: {
    chainId: '0x13881',
    chainIdDecimal: 80002,
    rpcUrls: ['https://rpc-amoy.polygon.technology'],
    blockExplorerUrls: ['https://amoy.polygonscan.com'],
    chainName: 'Polygon Amoy',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  polygon_mainnet: {
    chainId: '0x89',
    chainIdDecimal: 137,
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
};

export const POLYGON_AMOY_FAUCET = 'https://faucet.polygon.technology';
