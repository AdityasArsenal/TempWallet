import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { requestAccounts } from '../utils/walletUtils';

interface UseWalletConnectionProps {
    onStatusChange?: (isConnected: boolean) => void;
}

export function useWalletConnection({ onStatusChange }: UseWalletConnectionProps) {
    const [account, setAccount] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [isConnecting, setIsConnecting] = useState(false);
    const toast = useToast();

    // Handle disconnecting the wallet
    const handleDisconnect = useCallback(() => {
        // Clear connection state
        setAccount('');
        setUserName('');
        localStorage.removeItem('wallet_user_name');

        toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected",
            status: "info",
            duration: 3000,
            isClosable: true,
        });

        // Notify parent components
        if (onStatusChange) onStatusChange(false);
    }, [toast, onStatusChange]);

    // Check if wallet is already connected
    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    // Get accounts
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

                    if (accounts && accounts.length > 0) {
                        setAccount(accounts[0]);

                        // Get saved username
                        const savedName = localStorage.getItem('wallet_user_name');
                        if (savedName) {
                            setUserName(savedName);
                        }

                        // Notify parent components
                        if (onStatusChange) onStatusChange(true);
                    }
                } catch (error) {
                    console.error("Failed to check wallet connection:", error);
                }
            }
        };

        checkConnection();

        // Setup event listeners for wallet changes
        if (typeof window !== 'undefined' && window.ethereum) {
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length === 0) {
                    // User disconnected wallet in MetaMask
                    handleDisconnect();
                } else if (accounts[0] !== account) {
                    setAccount(accounts[0]);
                }
            };

            if (window.ethereum) {
                window.ethereum.on('accountsChanged', handleAccountsChanged);
                window.ethereum.on('chainChanged', () => window.location.reload());
            }

            // Cleanup
            return () => {
                if (window.ethereum) {
                    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                }
            };
        }
    }, [account, onStatusChange, handleDisconnect]);

    // Connect wallet function
    const connectWallet = async (session_id: string) => {
        if (typeof window === 'undefined' || !window.ethereum) {
            toast({
                title: "MetaMask Not Found",
                description: "Please install MetaMask browser extension to connect your wallet",
                status: "error",
                duration: 5000,
                isClosable: true,
            });

            // Open MetaMask installation page
            window.open('https://metamask.io/download/', '_blank');
            return;
        }

        try {
            setIsConnecting(true);

            // Request accounts
            const accounts = await requestAccounts();

            if (accounts && accounts.length > 0) {
                // Save account and name from form
                setAccount(accounts[0]);

                // Get saved username
                const savedName = localStorage.getItem('wallet_user_name');
                if (savedName) {
                    setUserName(savedName);
                }

                toast({
                    title: "Wallet Connected",
                    description: `Successfully connected to your MetaMask wallet`,
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                // Notify parent components
                if (onStatusChange) onStatusChange(true);
            }
        } catch (error: any) {
            console.error("Error connecting wallet:", error);
            toast({
                title: "Connection Failed",
                description: error.message || "Failed to connect to MetaMask",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsConnecting(false);
        }
    };

    return {
        account,
        userName,
        isConnecting,
        connectWallet,
        handleDisconnect,
    };
} 