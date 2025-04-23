// src/components/WelcomeButton.tsx
'use client';

// Import Chakra UI components and hooks
import { Button, useColorModeValue } from '@chakra-ui/react';

// Define props interface
interface WelcomeButtonProps {
  name: string | null; // User's name or null
}

// WelcomeButton component
export default function WelcomeButton({ name }: WelcomeButtonProps) {
  // Get glow color based on color mode (light/dark)
  const glowColor = useColorModeValue('blue.200', 'blue.400');

  return (
    // Button styled to match Hero's design
    <Button
      position="fixed" // Fixed position in top left
      top={14} // 16px margin from top
      left={4} // 16px margin from left
      rounded="full" // Rounded corners
      size="md" // Medium size
      bgGradient="linear(to-r, blue.400, purple.500)" // Gradient background
      color="white" // White text
      _hover={{
        bgGradient: 'linear(to-r, blue.500, purple.600)', // Darker gradient on hover
        boxShadow: `0 0 20px ${glowColor}`, // Glow effect on hover
      }}
      transition="all 0.3s ease" // Smooth transition
      zIndex={2} // Above background elements
      aria-label={`Welcome ${name || 'Guest'}`} // Accessibility label
    >
      {name ? `Welcome ${name}` : 'Welcome Guest'} {/* Display name or fallback */}
    </Button>
  );
}