// app/layout.tsx
'use client';

import { ChakraProvider } from '@/components/ChakraProvider';
import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { avalanche } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a QueryClient instance
const queryClient = new QueryClient();

// Configure wagmi
const config = createConfig({
  chains: [avalanche],
  connectors: [
    injected({
      target: 'metaMask',
    }),
  ],
  transports: {
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider>{children}</ChakraProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}