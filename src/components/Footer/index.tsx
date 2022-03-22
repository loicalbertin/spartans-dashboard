import { BooleanState } from "@/store/standard/base";
import { Box, Container, Divider, Flex, Icon, Link, Text, useColorModeValue } from "@chakra-ui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { BiCoffee } from "react-icons/bi";
import { DonateModal } from "../DonateModal";


export const Footer = observer(() => {
  const store = useLocalObservable(() => ({
    modelOpen: new BooleanState()
  }));

  return (
    <Box>
      <Divider />
      <Flex
        as={'footer'}
        minH={'60px'}
        boxShadow={'sm'}
        zIndex="999"
        justify={'center'}
        css={{
          backdropFilter: 'saturate(180%) blur(5px)',
          backgroundColor: useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')
        }}
      >

        <Container as={Flex} maxW={'7xl'} align={'center'} justifyContent={'center'}>
          <Text size="xs" align={'center'}>
            <Link onClick={() => store.modelOpen.setValue(true)}>
              <Icon as={BiCoffee} boxSize={6} />{' '}
              Buy me a coffee
            </Link>
          </Text>
          <DonateModal isOpen={store.modelOpen.value} onClose={() => store.modelOpen.setValue(false)} />
        </Container>
      </Flex>
    </Box>)
});
