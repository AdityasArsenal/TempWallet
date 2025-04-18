// src/components/layout/Navbar.tsx
'use client'
import {
  Box,
  Flex,
  HStack,
  Image,
  Link,
} from '@chakra-ui/react'
import WalletButton from './wallet/WalletButton'



export default function Navbar() {
  return (
    <Box px={4} position="fixed" w="full" zIndex={999}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={8} alignItems={'center'}>
          <Box>
            <Image
              h="32px"
              src="/images/logo.png"
              alt="Tempwallet"
            />
          </Box>
          <HStack
            as={'nav'}
            spacing={4}
            display={{ base: 'none', md: 'flex' }}>
            <Link href="#">Home</Link>
            <Link href="#">Technology</Link>
            <Link href="#">Features</Link>
            <Link href="#">Pricing</Link>
            <Link href="#">FAQ</Link>
          </HStack>
        </HStack>
        
        {/* Wallet Button Component */}
        <WalletButton/>
      </Flex>
    </Box>
  )
}