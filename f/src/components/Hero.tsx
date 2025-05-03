// src/components/Hero.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Box,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAccount, useDisconnect } from 'wagmi';
import { ethers } from 'ethers';
import { addAvalancheNetwork } from '../utils/addNetwork';
import { 
  createSmartAccount, 
  getMetaMaskProvider, 
  getSmartAccountBalance 
} from '../utils/smartAccountUtils';

// Define the type for the smart accounts
interface SmartAccountInfo {
  address: string;
  balance: string;
}

// InteractiveBackground and GlowingOrbs (unchanged)
const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    const gridSpacing = 40;
    const nodeRadius = 1;
    const maxConnections = 3;
    const connectionOpacity = 0.2;
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let x = 0; x < canvas.width; x += gridSpacing) {
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        const offsetX = Math.random() * 20 - 10;
        const offsetY = Math.random() * 20 - 10;
        nodes.push({
          x: x + offsetX,
          y: y + offsetY,
          vx: Math.random() * 0.2 - 0.1,
          vy: Math.random() * 0.2 - 0.1,
        });
      }
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (Math.random() < 0.01) {
          node.vx = Math.random() * 0.2 - 0.1;
          node.vy = Math.random() * 0.2 - 0.1;
        }
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(134, 147, 190, 0.6)';
        ctx.fill();
      });
      nodes.forEach((node, i) => {
        let connectionsCount = 0;
        for (let j = i + 1; j < nodes.length; j++) {
          if (connectionsCount >= maxConnections) break;
          const otherNode = nodes[j];
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < gridSpacing * 1.5) {
            const opacity = 1 - distance / (gridSpacing * 1.5);
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = `rgba(134, 147, 190, ${opacity * connectionOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
            connectionsCount++;
          }
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', setCanvasDimensions);
  }, []);
  return (
    <Box position="absolute" top={0} left={0} width="100%" height="100%" zIndex={0} overflow="hidden">
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
    </Box>
  );
};

const GlowingOrbs = () => {
  const orbRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const orbContainer = orbRef.current;
    if (!orbContainer) return;
    const orbCount = 6;
    for (let i = 0; i < orbCount; i++) {
      const orb = document.createElement('div');
      const size = Math.random() * 200 + 100;
      Object.assign(orb.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, rgba(51, 102, 255, 0.3), rgba(51, 102, 255, 0.05))`,
        filter: 'blur(60px)',
        transform: 'translate(-50%, -50%)',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: '0.7',
        zIndex: '-1',
        pointerEvents: 'none',
      });
      const animateDuration = Math.random() * 100 + 60;
      const animateDelay = Math.random() * -100;
      const keyframes = `
        @keyframes float-${i} {
          0% { transform: translate(-50%, -50%) translate(0, 0); }
          25% { transform: translate(-50%, -50%) translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px); }
          50% { transform: translate(-50%, -50%) translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px); }
          75% { transform: translate(-50%, -50%) translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px); }
          100% { transform: translate(-50%, -50%) translate(0, 0); }
        }
      `;
      const style = document.createElement('style');
      style.appendChild(document.createTextNode(keyframes));
      document.head.appendChild(style);
      orb.style.animation = `float-${i} ${animateDuration}s infinite ease-in-out ${animateDelay}s`;
      orbContainer.appendChild(orb);
    }
    return () => {
      while (orbContainer.firstChild) {
        orbContainer.removeChild(orbContainer.firstChild);
      }
    };
  }, []);
  return (
    <Box position="absolute" top={0} left={0} width="100%" height="100%" zIndex={0} overflow="hidden" ref={orbRef} />
  );
};

// Simple WalletConnectForm component for when references are removed
const WalletConnectForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader>Connect Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text>Please connect your MetaMask wallet to continue.</Text>
          <Button 
            mt={4} 
            colorScheme="blue" 
            onClick={onClose}
          >
            Close
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Simple WelcomeButton component
const WelcomeButton = ({ name }: { name: string | null }) => {
  if (!name) return null;
  
  return (
    <Box 
      position="fixed" 
      top={4} 
      right={4} 
      zIndex={10} 
      bg="blue.500" 
      px={4} 
      py={2} 
      borderRadius="md"
      color="white"
    >
      Welcome, {name}
    </Box>
  );
};

// Hero component
const Hero = () => {
  const toast = useToast();
  const [smartAccounts, setSmartAccounts] = useState<SmartAccountInfo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; sessionId: string } | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Use wagmi hooks
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleCreateSmartAccount = async () => {
    try {
      const provider = await getMetaMaskProvider();
      const signer = provider.getSigner();
      
      const { client, address } = await createSmartAccount(signer);
      
      // Fetch the balance of the newly created smart account
      const balance = await getSmartAccountBalance(address);
      
      // Add the smart account to the list
      setSmartAccounts(prev => [...prev, { address, balance }]);
      
      toast({
        title: 'Smart Account Created',
        description: `Address: ${address}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Smart account creation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create smart account',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await getMetaMaskProvider();
      setIsModalOpen(false);
      
      // If there's a name in local storage, use it
      const savedName = localStorage.getItem('wallet_user_name');
      if (savedName) {
        setUser({ name: savedName, sessionId: `session-${Date.now()}` });
      } else {
        // Default name if none exists
        const defaultName = "User";
        localStorage.setItem('wallet_user_name', defaultName);
        setUser({ name: defaultName, sessionId: `session-${Date.now()}` });
      }
      
      toast({
        title: 'Wallet Connected',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast({
        title: 'Connection Error',
        description: error.message || 'Failed to connect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const savedName = localStorage.getItem('wallet_user_name');
    if (savedName) {
      setUser({ name: savedName, sessionId: `session-${Date.now()}` });
    }
    
    // Try to add Avalanche C-Chain network to MetaMask
    addAvalancheNetwork().catch((error) => {
      console.error('Failed to add Avalanche C-Chain network:', error);
      toast({
        title: 'Network Error',
        description: error.message || 'Failed to add Avalanche C-Chain network',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    });
  }, [toast]);

  // Define glowColor for button hover effect
  const glowColor = useColorModeValue('rgba(0, 0, 255, 0.6)', 'rgba(0, 0, 255, 0.6)');

  return (
    <Box position="relative" minHeight="100vh" bg="gray.900">
      <WelcomeButton name={user?.name || null} />
      <InteractiveBackground />
      <GlowingOrbs />
      <Container maxW={'5xl'} position="relative" zIndex={1}>
        <Stack
          textAlign={'center'}
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
        >
          <Box data-aos="fade-down">
            <Heading
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
              lineHeight={'110%'}
              textShadow="0 0 15px rgba(255, 255, 255, 0.2)"
            >
              Revolutionize Your Transactions{' '}
              <Text as={'span'} color={'white'}>
                With Secure Blockchain Solutions
              </Text>
            </Heading>
          </Box>
          <Text color={'gray.300'} maxW={'3xl'} data-aos="fade-up" data-aos-delay="200">
            Tempwallet is a secure blockchain platform that revolutionizes digital transactions with decentralized technology.
            Our user-friendly interface enables seamless wallet creation and management while ensuring transparency and fraud protection.
          </Text>
          <Stack spacing={6} direction={'column'} data-aos="fade-up" data-aos-delay="400">
            <Button
              rounded={'full'}
              px={6}
              size={'lg'}
              bgGradient="linear(to-r, blue.400, purple.500)"
              color="white"
              _hover={{
                bgGradient: 'linear(to-r, blue.500, purple.600)',
                boxShadow: `0 0 20px ${glowColor}`,
              }}
              transition="all 0.3s ease"
              onClick={() => setIsModalOpen(true)}
              isDisabled={isConnected}
            >
              {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </Button>
            <Button
              rounded={'full'}
              px={6}
              size={'lg'}
              bgGradient="linear(to-r, purple.400, pink.500)"
              color="white"
              _hover={{
                bgGradient: 'linear(to-r, purple.500, pink.600)',
                boxShadow: `0 0 20px ${glowColor}`,
              }}
              transition="all 0.3s ease"
              onClick={handleCreateSmartAccount}
              isDisabled={!isConnected}
            >
              Create Smart Account
            </Button>
          </Stack>
          {smartAccounts.length > 0 && (
            <Box
              mt={8}
              p={{ base: 4, md: 6 }}
              bg="gray.800"
              borderRadius="lg"
              boxShadow="0 0 20px rgba(0, 0, 0, 0.5)"
              maxW={{ base: 'full', md: '3xl' }}
              w="100%"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <Heading size="md" mb={4} color="white">
                Smart Accounts
              </Heading>
              <Table variant="simple" colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th color="gray.400">Wallet Address</Th>
                    <Th color="gray.400">Balance (AVAX)</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {smartAccounts.map((account, index) => (
                    <Tr key={index}>
                      <Td color="gray.300">{account.address}</Td>
                      <Td color="gray.300">{account.balance}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
          <WalletConnectForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;