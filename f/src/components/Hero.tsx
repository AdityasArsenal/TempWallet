'use client'

import { useEffect, useRef } from 'react'
import {
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Box,
  useColorModeValue,
} from '@chakra-ui/react'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Interactive background component
const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match window
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Grid settings
    const gridSpacing = 40;
    const nodeRadius = 1;
    const maxConnections = 3;
    const connectionOpacity = 0.2;
    
    // Create grid nodes
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    
    for (let x = 0; x < canvas.width; x += gridSpacing) {
      for (let y = 0; y < canvas.height; y += gridSpacing) {
        // Add slight random offset to grid position
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
    
    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw nodes
      nodes.forEach(node => {
        // Move node slightly
        node.x += node.vx;
        node.y += node.vy;
        
        // Change direction randomly
        if (Math.random() < 0.01) {
          node.vx = Math.random() * 0.2 - 0.1;
          node.vy = Math.random() * 0.2 - 0.1;
        }
        
        // Boundary check with bounce effect
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(134, 147, 190, 0.6)';
        ctx.fill();
      });
      
      // Draw connections between close nodes
      nodes.forEach((node, i) => {
        let connectionsCount = 0;
        
        for (let j = i + 1; j < nodes.length; j++) {
          if (connectionsCount >= maxConnections) break;
          
          const otherNode = nodes[j];
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // If nodes are close enough, draw a line between them
          if (distance < gridSpacing * 1.5) {
            // Calculate opacity based on distance
            const opacity = 1 - (distance / (gridSpacing * 1.5));
            
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
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
    };
  }, []);
  
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={0}
      overflow="hidden"
    >
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};

// Glowing orb animation effect
const GlowingOrbs = () => {
  const orbRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const orbContainer = orbRef.current;
    if (!orbContainer) return;
    
    // Create orbs
    const orbCount = 6;
    
    for (let i = 0; i < orbCount; i++) {
      const orb = document.createElement('div');
      const size = Math.random() * 200 + 100;
      
      // Style the orb
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
      
      // Animate position
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
      
      // Create and append style
      const style = document.createElement('style');
      style.appendChild(document.createTextNode(keyframes));
      document.head.appendChild(style);
      
      // Apply animation
      orb.style.animation = `float-${i} ${animateDuration}s infinite ease-in-out ${animateDelay}s`;
      
      // Add to container
      orbContainer.appendChild(orb);
    }
    
    // Clean up
    return () => {
      while (orbContainer.firstChild) {
        orbContainer.removeChild(orbContainer.firstChild);
      }
    };
  }, []);
  
  return (
    <Box
      ref={orbRef}
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={0}
      overflow="hidden"
    />
  );
};

export default function Hero() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  const glowColor = useColorModeValue('blue.200', 'blue.400');

  return (
    <Box position="relative" minHeight="100vh" bg="gray.900">
      {/* Background elements */}
      <InteractiveBackground />
      <GlowingOrbs />
      
      {/* Content */}
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
          <Text
            color={'gray.300'}
            maxW={'3xl'}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Tempwallet is a secure blockchain platform that revolutionizes digital transactions with decentralized technology. 
            Our user-friendly interface enables seamless wallet creation and management while ensuring transparency and fraud protection.
          </Text>
          <Stack
            spacing={6}
            direction={'row'}
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Button
              rounded={'full'}
              px={6}
              size={'lg'}
              bgGradient="linear(to-r, blue.400, purple.500)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, blue.500, purple.600)",
                boxShadow: `0 0 20px ${glowColor}`,
              }}
              transition="all 0.3s ease"
            >
              Get Started
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}