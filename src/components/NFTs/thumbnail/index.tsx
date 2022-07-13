import { NFTState } from "@/store/lib/NFTState";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Badge, Box, Flex, Link, Spacer, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import { observer, useLocalObservable } from "mobx-react-lite";


export interface NFTThumbnailProps {
  state: NFTState;
}

export const NFTThumbnail = observer((props: NFTThumbnailProps) => {

  const store = useLocalObservable(() => ({
    nftState: props.state,
  }));

  return (
    <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <Image src={store.nftState.config.logo} />
      <Box p='6'>
        <Flex alignItems='center' justify-content='space-between'>
          <Text>{store.nftState.config.name}</Text>
          <Spacer />
          <Badge borderRadius='full' px='2' colorScheme='teal'>
            <Link href={store.nftState.config.explorerURL + '/token/' + store.nftState.config.address + '?a=' + store.nftState.tokenId.toString()}
              isExternal>
              {store.nftState.tokenId.toString()} <ExternalLinkIcon mx='2px' />
            </Link>

          </Badge>
        </Flex>
      </Box>
    </Box>
  );
});
