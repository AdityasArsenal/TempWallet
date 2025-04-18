'use client'

import { Box } from '@chakra-ui/react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Partners from '@/components/Partners'

export default function Home() {
  return (
    <Box>
      <Navbar />
      <Hero />
      <Partners />
    </Box>
  )
}