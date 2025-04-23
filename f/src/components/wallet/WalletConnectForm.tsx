// src/components/wallet/WalletConnectForm.tsx
'use client';

// Import React and Chakra UI components
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

// Define props interface
interface WalletConnectFormProps {
  isOpen: boolean; // Controls modal visibility
  onClose: () => void; // Closes the modal
  onConnect: (user: { name: string; address?: string; sessionId: string }) => Promise<void>; // Callback for successful connection
  isConnecting: boolean; // Indicates if connection is in progress
}

// WalletConnectForm component
export default function WalletConnectForm({
  isOpen,
  onClose,
  onConnect,
  isConnecting,
}: WalletConnectFormProps) {
  // State for user name input
  const [userName, setUserName] = useState('');
  // State for name input validation error
  const [nameError, setNameError] = useState('');
  // Chakra UI toast for user notifications
  const toast = useToast();

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Validate name input
    if (!userName.trim()) {
      setNameError('Please enter your name');
      return;
    }

    try {
      // Simulate MetaMask connection
      let metamask_address: string | undefined;
      if (window.ethereum) {
        try {
          // Request MetaMask accounts
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          metamask_address = accounts[0];
        } catch (error) {
          throw new Error('Failed to connect to MetaMask');
        }
      } else {
        // Handle missing MetaMask
        throw new Error('MetaMask or a compatible wallet is not installed');
      }

      // Simulate successful authentication
      const sessionId = `session-${Date.now()}`; // Mock session ID
      const userData = {
        name: userName.trim(),
        address: metamask_address,
        sessionId,
      };

      // Store name in localStorage for persistence
      localStorage.setItem('wallet_user_name', userData.name);

      // Call parent callback with user data
      await onConnect(userData);

      // Show success toast
      toast({
        title: 'Connection Successful',
        description: `Welcome, ${userData.name}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form and close modal
      setUserName('');
      setNameError('');
      onClose();
    } catch (error) {
      // Log error for debugging
      console.error('Error connecting wallet:', error);
      // Show error toast
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
    // Modal for wallet connection form
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        {/* Modal header */}
        <ModalHeader fontSize="sm" color="gray.400">
          Connect Your Wallet
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Form layout with vertical stack */}
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <Text fontSize="sm" color="gray.400">
              Please enter your name before connecting to MetaMask
            </Text>
            {/* Name input field */}
            <FormControl isInvalid={!!nameError} isRequired>
              <FormLabel fontSize="sm" color="gray.400">
                Your Name
              </FormLabel>
              <Input
                fontSize="sm"
                color="gray.300"
                bg="gray.700"
                borderColor="gray.600"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value); // Update name state
                  setNameError(''); // Clear error on input
                }}
                _hover={{ borderColor: 'blue.400' }}
                _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' }}
              />
              {/* Display name error if present */}
              {nameError && (
                <Text color="red.400" fontSize="sm" mt={1}>
                  {nameError}
                </Text>
              )}
            </FormControl>
            <Text fontSize="sm" color="gray.400">
              After submitting, you'll be prompted to connect your MetaMask wallet
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          {/* Cancel button */}
          <Button variant="ghost" mr={3} onClick={onClose} colorScheme="gray">
            Cancel
          </Button>
          {/* Submit button */}
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isConnecting}
            loadingText="Connecting..."
            rounded="full"
            bgGradient="linear(to-r, blue.400, purple.500)"
            _hover={{ bgGradient: 'linear(to-r, blue.500, purple.600)' }}
            transition="all 0.3s ease"
          >
            Connect Wallet
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}