import { useState, useCallback, useEffect } from 'react';
import { ethers, BrowserProvider } from 'ethers';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      providers?: Array<{
        isMetaMask?: boolean;
        request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
        on: (event: string, callback: (...args: unknown[]) => void) => void;
        removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      }>;
    };
  }
}

interface WalletState {
  provider: BrowserProvider | null;
  account: string | null;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    provider: null,
    account: null,
    chainId: null,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(async (auto = false) => {
    if (state.isConnecting) return;

    const ethereum = window.ethereum;
    if (!ethereum) {
      if (!auto) {
        setState(prev => ({ ...prev, error: 'No wallet detected. Install MetaMask.' }));
      }
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      let selectedProvider = ethereum;
      if (ethereum.providers && Array.isArray(ethereum.providers)) {
        selectedProvider = ethereum.providers.find(p => p.isMetaMask) || ethereum.providers[0];
      }

      const accounts = await selectedProvider.request({
        method: auto ? 'eth_accounts' : 'eth_requestAccounts'
      }) as string[];

      if (Array.isArray(accounts) && accounts.length > 0) {
        const provider = new BrowserProvider(selectedProvider as any);
        const network = await provider.getNetwork();
        
        setState({
          provider,
          account: accounts[0],
          chainId: Number(network.chainId),
          isConnecting: false,
          error: null,
        });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: auto ? '' : errorMessage,
      }));
    }
  }, [state.isConnecting]);

  const disconnect = useCallback(() => {
    setState({
      provider: null,
      account: null,
      chainId: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    const ethereum = window.ethereum;
    if (!ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accs = accounts as string[];
      if (accs.length === 0) {
        disconnect();
      } else {
        setState(prev => ({ ...prev, account: accs[0] }));
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);

    connect(true);

    return () => {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [connect, disconnect]);

  return {
    ...state,
    connect: () => connect(false),
    disconnect,
  };
}
