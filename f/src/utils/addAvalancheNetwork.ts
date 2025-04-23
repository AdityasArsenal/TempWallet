// src/utils/addAvalancheNetwork.ts
export const addAvalancheNetwork = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: 43114,
            chainName: 'Avalanche C-Chain',
            nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
            rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
            blockExplorerUrls: ['https://snowtrace.io'],
          },
        ],
      });
    } catch (error) {
      console.error('Error adding Avalanche network:', error);
      throw error;
    }
  };