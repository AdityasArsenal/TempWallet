// src/utils/addNetwork.ts
export const addAvalancheNetwork = async () => {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask is not installed or not running in a browser environment');
      }
  
      const chainId = '0xa86a'; // 43114 in hex
      console.log('Adding Avalanche C-Chain with chainId:', chainId);
      const params = [
        {
          chainId,
          chainName: 'Avalanche C-Chain',
          nativeCurrency: {
            name: 'Avalanche',
            symbol: 'AVAX',
            decimals: 18,
          },
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io'],
        },
      ];
      console.log('wallet_addEthereumChain params:', JSON.stringify(params, null, 2));
  
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params,
      });
  
      console.log('Switching to Avalanche C-Chain with chainId:', chainId);
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error) {
      console.error('Failed to add or switch to Avalanche C-Chain network:', error);
      throw error;
    }
  };