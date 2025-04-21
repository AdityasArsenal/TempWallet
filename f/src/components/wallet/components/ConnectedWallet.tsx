import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Text,
    HStack,
    Box,
} from '@chakra-ui/react';
import { formatAddress } from '../utils/walletUtils';

interface ConnectedWalletProps {
    account: string;
    userName: string;
    onDisconnect: () => void;
}

export function ConnectedWallet({ account, userName, onDisconnect }: ConnectedWalletProps) {
    return (
        <Menu>
            <MenuButton
                as={Button}
                size="sm"
                rounded="full"
                px={6}
                colorScheme="green"
            >
                <HStack spacing={1}>
                    <Text>
                        {userName ? userName : formatAddress(account)}
                    </Text>
                    <Box as="span" ml={1}>▼</Box>
                </HStack>
            </MenuButton>
            <MenuList>
                <MenuItem fontSize="sm" onClick={() => navigator.clipboard.writeText(account)}>
                    Copy Address
                </MenuItem>
                <MenuItem fontSize="sm" onClick={onDisconnect}>
                    Disconnect Wallet
                </MenuItem>
            </MenuList>
        </Menu>
    );
} 