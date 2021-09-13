import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

import Jazzicon from '@metamask/jazzicon';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import Web3Modal from "web3modal";
import styled from "@emotion/styled";
import { useState } from "react";

type Props = {
  provider?: string;
  infuraId?: string;
  network: string;
};

type AvatarProps = {
    account: string;
}

const StyledAvatar = styled.div`
    height: 1rem;
    width: 1rem;
    border-radius: 1.125rem;
    background-color: black
`;

function Avatar(props: AvatarProps) {
    const ref = useRef<HTMLDivElement>();

    useEffect(() => {
        if (ref.current) {
            ref.current.innerHTML = "";
            ref.current.appendChild(Jazzicon(16, parseInt(props.account.slice(2, 10), 16)));
        }
    }, []);

    return <StyledAvatar ref={ref as any} />
}

export default function ConnectWalletButton(props: Props) {
  const [account, setAccount] = useState<string>();
  const [balance, setBalance] = useState<string>();
  const web3 = new Web3(Web3.givenProvider || props.provider);

  const providerOptions = {
    walletConnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: props.infuraId,
      },
    },
  };

  const modal = new Web3Modal({
    network: props.network,
    providerOptions: providerOptions,
    cacheProvider: false,
  });

  async function loadAccount() {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length !== 0) setAccount(accounts[0]);
  }

  useEffect(() => {
    loadAccount();
  });

  useEffect(() => {
    async function loadBalance() {
      if (!account) return;
      const balance = await web3.eth.getBalance(account);
      setBalance(balance);
    }
    loadBalance();
  }, [account]);

  const onClick = async () => {
    await modal.connect();
    loadAccount();
  };

  return account ? (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Box display="flex" alignItems="center" background="gray.700" borderRadius="xl" py="1px">
        <Box px="3">
          <Text color="white" fontSize="md">
            {balance && web3.utils.fromWei(balance).substring(0, 5)} ETH
          </Text>
        </Box>
        <Button
          bg="gray.800"
          border="1px solid transparent"
          _hover={{
            border: "1px",
            borderStyle: "solid",
            borderColor: "blue.400",
            backgroundColor: "gray.700",
          }}
          borderRadius="xl"
          m="1px"
          px={3}
          height="38px"
        >
          <Text color="white" fontSize="md" fontWeight="medium" mr="2">
            {account && `${account.slice(0, 6)}...${account.slice(account.length - 4, account.length)}`}
          </Text>
          {account && <Avatar account={account} />}
        </Button>
      </Box>
    </Flex>
  ) : (
    <Button onClick={onClick}>Connect your wallet</Button>
  );
}
