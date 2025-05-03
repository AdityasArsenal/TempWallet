'use client'

import { Box } from '@chakra-ui/react'
import Navbar from '@/components/Navbar'
import Partners from '@/components/Partners'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <Box>
      <Navbar />
      <Hero />
      <Partners />
    </Box>
  )
}