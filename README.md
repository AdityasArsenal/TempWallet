# TempWallet DApp

A gasless smart wallet DApp built on Avalanche using Next.js and 0xGasless AgentKit.

## Features

- Connect MetaMask wallet
- Create smart wallets on Avalanche
- Gasless transactions
- Paymaster integration

## Prerequisites

- Node.js (v18 or higher)
- MetaMask wallet
- PostgreSQL database

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd tempwallet
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tempwallet"
NEXT_PUBLIC_AVALANCHE_RPC_URL="https://api.avax.network/ext/bc/C/rpc"
NEXT_PUBLIC_CHAIN_ID=43114
```

4. Set up the database:
```bash
npx prisma migrate dev
```

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/` - Next.js app router pages
- `src/contexts/` - React contexts (Web3, etc.)
- `src/components/` - Reusable React components
- `prisma/` - Database schema and migrations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
