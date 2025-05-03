// src/utils/smartAccountUtils.ts
import { ethers } from 'ethers';
import { createPublicClient, http, PublicClient } from 'viem';
import { avalanche } from 'viem/chains';
import { DEFAULT_ENTRYPOINT_ADDRESS } from '@biconomy/account';
import { Bundler } from '@biconomy/bundler';
import { BiconomyPaymaster } from '@biconomy/paymaster';

// Define types for Biconomy Smart Account
interface Transaction {
  to: string;
  value: string | number | bigint;
  data?: string;
}

interface UserOpResponse {
  userOpHash: string;
  wait: () => Promise<any>;
}

interface BiconomySmartAccount {
  getAccountAddress: () => Promise<string>;
  sendTransaction: (tx: Transaction | Transaction[]) => Promise<UserOpResponse>;
}

// Avalanche C-Chain configuration for viem
export const avalancheChain = {
  ...avalanche,
  id: 43114,
  name: 'Avalanche C-Chain',
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
    public: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Snowtrace', url: 'https://snowtrace.io' },
  },
};

// Create a public client for blockchain interactions (e.g., balance fetching)
export const publicClient: PublicClient = createPublicClient({
  chain: avalancheChain,
  transport: http(),
});

// Get MetaMask provider for signer creation
export const getMetaMaskProvider = async () => {
  // Ensure the code runs in a browser environment with MetaMask installed
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed or not running in a browser environment');
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // Request account access from MetaMask
  await provider.send('eth_requestAccounts', []);
  return provider;
};

// Create a Biconomy smart account for the user - using dynamic import to avoid circular dependency
export const createSmartAccount = async (signer: ethers.Signer): Promise<{
  client: BiconomySmartAccount;
  address: string;
}> => {
  try {
    // Validate Biconomy API key
    const apiKey = process.env.NEXT_PUBLIC_BICONOMY_API_KEY;
    if (!apiKey) {
      throw new Error('Biconomy API key is missing. Please set NEXT_PUBLIC_BICONOMY_API_KEY in .env.local');
    }

    // Verify MetaMask is on Avalanche C-Chain (chainId: 0xa86a)
    if (typeof window !== 'undefined' && window.ethereum) {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (currentChainId !== '0xa86a') {
        throw new Error(
          `Invalid chain ID: Expected 0xa86a (Avalanche C-Chain), but got ${currentChainId}. Please switch to Avalanche C-Chain in MetaMask.`
        );
      }
    } else {
      throw new Error('MetaMask is not available');
    }

    // Create bundler and paymaster instances
    const bundler = new Bundler({
      bundlerUrl: 'https://bundler.biconomy.io/api/v2/43114/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44',
      chainId: 43114,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    });

    const paymaster = new BiconomyPaymaster({
      paymasterUrl: `https://paymaster.biconomy.io/api/v1/43114/${apiKey}`,
    });

    // Dynamically import BiconomySmartAccountV2 to avoid circular dependencies
    const biconomyModule = await import('@biconomy/account');
    const BiconomySmartAccountV2 = biconomyModule.BiconomySmartAccountV2;
    
    // Create the smart account instance
    const smartAccount = await BiconomySmartAccountV2.create({
      chainId: 43114,
      bundler: bundler as any,
      paymaster: paymaster as any,
      signer,
      entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    });

    // Get the smart account address
    const smartAccountAddress = await smartAccount.getAccountAddress();

    // Return a client with methods for interacting with the smart account
    return {
      client: {
        getAccountAddress: () => smartAccount.getAccountAddress(),
        sendTransaction: async (tx: Transaction | Transaction[]) => {
          // Normalize transactions to an array
          const transactions = Array.isArray(tx) ? tx : [tx];
          // Build and send UserOperation for gasless transactions
          const userOp = await smartAccount.buildUserOp(transactions);
          console.log('UserOp:', userOp); // Debug log for UserOperation
          const response = await smartAccount.sendUserOp(userOp);
          console.log('UserOp Response:', response); // Debug log for response
          return {
            userOpHash: response.userOpHash,
            wait: () => response.wait(),
          };
        },
      },
      address: smartAccountAddress,
    };
  } catch (error: any) { // Explicitly type error as any to handle unknown type
    // Enhanced error handling for specific MetaMask and Biconomy errors
    let message = 'Failed to create smart account';
    if (error.code === 4902) {
      message = 'Please add Avalanche C-Chain to MetaMask';
    } else if (error.message?.includes('chainId')) {
      message = 'Chain ID error: Please make sure you are connected to Avalanche C-Chain';
    } else if (error.message) {
      message = error.message;
    }
    console.error('Error creating smart account:', error);
    throw new Error(message);
  }
};

// Fetch the balance of a smart account
export const getSmartAccountBalance = async (address: string): Promise<string> => {
  try {
    // Use publicClient to fetch the balance in wei
    const balance = await publicClient.getBalance({ address: address as `0x${string}` });
    // Convert balance from wei to AVAX
    return ethers.utils.formatEther(balance.toString());
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0';
  }
};