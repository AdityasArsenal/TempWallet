'use client'

import {
  Box,
  Container,
  SimpleGrid,
  Image,
  Heading,
} from '@chakra-ui/react'

const partners = [
  { name: 'Tron', logo: '/images/tron.png' },
  { name: 'Cosmos', logo: '/images/cosmos.png' },
  { name: 'Stellar', logo: '/images/stellar.png' },
  { name: 'OKX', logo: '/images/okx.png' },
  { name: 'Ethereum', logo: '/images/ethereum.png' },
  { name: 'VeChain', logo: '/images/vechain.png' },
]

export default function Partners() {
  return (
    <Box bg="blackAlpha.400" py={20}>
      <Container maxW={'6xl'}>
        <Heading
          textAlign="center"
          mb={10}
          fontSize={'2xl'}
          data-aos="fade-up"
        >
          Leading the Way in Crypto Trust with Tempwallet
        </Heading>
        <SimpleGrid
          columns={{ base: 2, md: 3, lg: 6 }}
          spacing={8}
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {partners.map((partner) => (
            <Box
              key={partner.name}
              bg="whiteAlpha.100"
              p={4}
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              transition="all 0.3s"
              _hover={{ transform: 'scale(1.05)' }}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                maxH="40px"
                filter="brightness(0) invert(1)"
              />
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}