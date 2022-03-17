import {
  Box,
  Button,
  HStack, Icon, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, useClipboard, VStack
} from '@chakra-ui/react';
import { BiCopy } from "react-icons/bi";
import { observer, useLocalObservable } from 'mobx-react-lite';
import { StringState } from '@/store/standard/base';

interface PropsType {
  isOpen: boolean;
  onClose: () => void;
}

export const DonateModal = observer((props: PropsType) => {
  const store = useLocalObservable(() => ({
    donationAddress: new StringState({ value: "0x6c212303eB7005e8461df6C430bD5DdBb84Bef45" })
  }));


  const { onCopy } = useClipboard(store.donationAddress.value);
  return (
    <>
      <Modal size={'xl'} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Make a donation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={'6'} align={'stretch'} justifyContent={'stretch'}>
              <Text>
                👋 Do you like this dashboard?
              </Text>
              <Text>
                Do you know that it is maintained by an independent developer on my free time?
              </Text>
              <Text>
                You want to contribute to the hosting costs, support me by buying me a coffee or
                just say thank you?
              </Text>
              <Text>
                Then, you may consider making a donation to the below address.
              </Text>
              <Text>
                Any token welcome but these from the KnightSwap / WolfenDen ecosystem preferred!
              </Text>
              <Spacer />
              <Box w='100%' p={4} borderWidth='1px' borderRadius='lg'>
                <HStack p={4} >
                  <VStack align={'left'} justifyContent={'left'}>
                    <Text >Donation Address:</Text>
                    <Text>{store.donationAddress.value}</Text>
                  </VStack>
                  <Spacer />
                  <Button variant={'ghost'} onClick={onCopy} leftIcon={<Icon as={BiCopy} onClick={onCopy} boxSize={6} />} />

                </HStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  )

});
