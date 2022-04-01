import { BigNumberState } from "@/store/standard/BigNumberState";
import { Box, HStack, Stack, Text } from "@chakra-ui/layout";
import { Image, Skeleton } from "@chakra-ui/react";
import { observer, useLocalObservable } from "mobx-react-lite";

export interface CurrencyLoaderProps {
  number: BigNumberState;
  imageRef: string;
}

export const CurrencyLoader = observer((props: CurrencyLoaderProps) => {
  const store = useLocalObservable(() => ({
    number: props.number,
  }));
  return (

    <HStack spacing='8px' placeContent={'flex-end'} >
      {store.number.loading ? (
        <Skeleton minW={'25%'} maxW={'50%'}><Text>Workaround</Text></Skeleton>
        ) : (
          <Text fontSize='x-large' fontWeight='bold' hidden={store.number.loading}>{store.number.format}</Text>
        )}

      <Image src={props.imageRef} boxSize="32px" />
    </HStack>

  );
});

