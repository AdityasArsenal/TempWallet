import { Button } from '@chakra-ui/react';
import WalletConnectForm from '../WalletConnectForm';

interface DisconnectedWalletProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onConnect: (session_id: string) => Promise<void>;
    isConnecting: boolean;
}

export function DisconnectedWallet({
    isOpen,
    onOpen,
    onClose,
    onConnect,
    isConnecting
}: DisconnectedWalletProps) {
    return (
        <>
            <Button
                size="sm"
                rounded="full"
                px={6}
                colorScheme="blue"
                onClick={onOpen}
            >
                Connect Wallet
            </Button>

            <WalletConnectForm
                isOpen={isOpen}
                onClose={onClose}
                onConnect={onConnect}
                isConnecting={isConnecting}
            />
        </>
    );
} 