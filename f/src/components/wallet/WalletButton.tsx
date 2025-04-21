// src/components/wallet/WalletButton.tsx
import { useDisclosure } from '@chakra-ui/react';
import { useWalletConnection } from './hooks/useWalletConnection';
import { ConnectedWallet } from './components/ConnectedWallet';
import { DisconnectedWallet } from './components/DisconnectedWallet';

interface WalletButtonProps {
  onStatusChange?: (isConnected: boolean) => void;
}

export default function WalletButton({ onStatusChange }: WalletButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    account,
    userName,
    isConnecting,
    connectWallet,
    handleDisconnect
  } = useWalletConnection({ onStatusChange });

  // Rendering logic based on account state
  if (!account) {
    return (
      <DisconnectedWallet
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        onConnect={async (sessionId) => {
          connectWallet(sessionId);
          onClose();
          return Promise.resolve();
        }}
        isConnecting={isConnecting}
      />
    );
  }

  // Only rendered when there is a connected account
  return (
    <ConnectedWallet
      account={account}
      userName={userName}
      onDisconnect={handleDisconnect}
    />
  );
}