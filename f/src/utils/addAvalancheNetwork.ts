// src/utils/addAvalancheNetwork.ts
export const addAvalancheNetwork = async () => {
  try {
    // Check if window and window.ethereum are defined
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed or not running in a browser environment');
    }

    // Ensure chainId is a 0x-prefixed hex string
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

    // Switch to Avalanche C-Chain
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