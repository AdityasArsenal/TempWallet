import { ethers } from 'ethers';
import { AuthResponse } from './types';

/**
 * Formats an Ethereum address for display by shortening it
 */
export const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Connects to MetaMask and signs a message
 */
export const connectAndSignMessage = async (message: string) => {
    if (!window.ethereum) {
        throw new Error('MetaMask not found');
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const metamask_address = await signer.getAddress();
    const signature = await signer.signMessage(message);

    return { metamask_address, signature };
};

/**
 * Fetches a message from the authentication server
 */
export const fetchAuthMessage = async (): Promise<string> => {
    const response = await fetch('http://localhost:3001/auth/message');
    const data = await response.json();
    return data.message;
};

/**
 * Authenticates with the server using wallet signature
 */
export const authenticateWithServer = async (
    metamask_address: string,
    message: string,
    signature: string,
    userName: string
): Promise<AuthResponse> => {
    const loginResponse = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            metamask_address,
            message,
            signature,
            userName,
        }),
    });

    return await loginResponse.json();
};

/**
 * Requests MetaMask accounts from the user
 */
export const requestAccounts = async (): Promise<string[]> => {
    if (!window.ethereum) {
        throw new Error('MetaMask not found');
    }

    return await window.ethereum.request({
        method: 'eth_requestAccounts'
    });
}; 