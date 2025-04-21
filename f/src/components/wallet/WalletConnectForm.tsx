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
import { fetchAuthMessage, connectAndSignMessage, authenticateWithServer } from './utils/walletUtils';
import { AuthResponse } from './utils/types';

interface WalletConnectFormProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: (session_id: string) => Promise<void>;
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
            const message = await fetchAuthMessage();
            console.log("message from backend for the signature:", message);

            // 2. Connect to MetaMask and sign the message
            if (window.ethereum) {
                const { metamask_address, signature } = await connectAndSignMessage(message);
                console.log("signature by metamask:", signature);

                // 3. Send data to the backend for login/authentication
                const loginData = await authenticateWithServer(
                    metamask_address,
                    message,
                    signature,
                    userName
                );

                if (loginData.session_id) {
                    // Save username to localStorage
                    localStorage.setItem('wallet_user_name', userName);

                    // Login successful
                    await onConnect(loginData.session_id);
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