import { useState, FormEvent } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { ethers } from 'ethers'; // Import ethers.js

interface WalletConnectFormProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: (session_id: string) => Promise<void>; // Modified: onConnect now receives session_id
    isConnecting: boolean;
}

export default function WalletConnectForm({
    isOpen,
    onClose,
    onConnect,
    isConnecting,
}: WalletConnectFormProps) {
    const [userName, setUserName] = useState('');
    const [nameError, setNameError] = useState('');
    const toast = useToast();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Validate input
        if (!userName.trim()) {
            setNameError('Please enter your name');
            return;
        }

        try {
            // 1. Get the message from the backend
            const response = await fetch('http://localhost:3001/auth/message');
            const data = await response.json();
            const messagee = data.message;

            const message = "79a1f0b1-174a-4545-b145-248e34f13ed4";
            console.log("message from backend for the signature:", message);

            // 2. Connect to MetaMask and sign the message
            if (window.ethereum) {
                await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const metamask_address = await signer.getAddress(); // Get the connected address
                const signature = await signer.signMessage(message);

                console.log("signature by metamask:", signature);

                // 3. Send data to the backend for login/authentication
                const loginResponse = await fetch('http://localhost:3001/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        metamask_address,
                        message,
                        signature,
                        userName, // Send the userName to the backend
                    }),
                });

                const loginData = await loginResponse.json();

                if (loginResponse.ok) {
                    // Login successful
                    const session_id = loginData.session_id;
                    await onConnect(session_id); // Pass the session_id to the parent component
                } else {
                    // Login failed
                    toast({
                        title: 'Login Error',
                        description: loginData.error || 'Failed to login',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } else {
                toast({
                    title: 'MetaMask Not Found',
                    description: 'Please install MetaMask or a compatible wallet',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            toast({
                title: 'Connection Error',
                description: error instanceof Error ? error.message : 'Failed to connect wallet',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize="sm" color="gray.600">
                    Connect Your Wallet
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                        <Text fontSize="sm" color="gray.600">
                            Please enter your name before connecting to MetaMask
                        </Text>
                        <FormControl isInvalid={!!nameError}>
                            <FormLabel fontSize="sm" color="gray.600">
                                Your Name
                            </FormLabel>
                            <Input
                                fontSize="sm"
                                color="gray.500"
                                placeholder="Enter your name"
                                value={userName}
                                onChange={(e) => {
                                    setUserName(e.target.value);
                                    setNameError('');
                                }}
                                isRequired
                            />
                            {nameError && (
                                <Text color="red.500" fontSize="sm" mt={1}>
                                    {nameError}
                                </Text>
                            )}
                        </FormControl>
                        <Text fontSize="sm" color="gray.500">
                            After submitting, you'll be prompted to connect your MetaMask wallet
                        </Text>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="blue"
                        onClick={handleSubmit}
                        isLoading={isConnecting}
                        loadingText="Connecting..."
                    >
                        Connect Wallet
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}