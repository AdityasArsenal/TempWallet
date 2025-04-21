/**
 * Common types used across wallet components
 */

export interface WalletUser {
    id?: string;
    metamask_address: string;
    userName?: string;
    session_id?: string;
}

export interface AuthResponse {
    session_id?: string;
    error?: string;
}

// Ethereum provider interface
export interface EthereumProvider {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (eventName: string, callback: (...args: any[]) => void) => void;
    removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
}

// Extend the global Window interface to include ethereum
declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
} 