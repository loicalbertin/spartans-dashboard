import { CoinPricesState } from "@/store/lib/CoinPricesState";
import { BigNumberState } from "@/store/standard/BigNumberState";
import { HStack, Text, VStack } from "@chakra-ui/layout";
import { Image, Skeleton } from "@chakra-ui/react";
import { computed } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useStore } from '../../store/index';

export interface CurrencyLoaderProps {
  number: BigNumberState;
  imageRef: string;
  coinPrice: CoinPricesState;
}

export const CurrencyLoader = observer((props: CurrencyLoaderProps) => {
  const { currencies } = useStore();

  const store = useLocalObservable(() => ({
    number: props.number,
    coinPrice: props.coinPrice,
  }),
  );

  const tokenPriceUSD = computed(() => {
    if (store.coinPrice.priceCurrency.loading) {
      return new BigNumberState({});
    }
    return new BigNumberState({
      value: store.number.value.multipliedBy(store.coinPrice.priceCurrency.value),
      decimals: 18,
      loading: false,
      numeralFormat: currencies.currencyConfigs.get(currencies.currency.value).numeralFormat,
    });
  });


  return (

    <VStack alignItems="flex-end" spacing={0}>
      <HStack spacing='8px' placeContent={'flex-end'} >
        {store.number.loading ? (
          <Skeleton minW={'25%'} maxW={'50%'}><Text>Workaround</Text></Skeleton>
        ) : (
          <Text fontSize='x-large' fontWeight='bold' hidden={store.number.loading}>{store.number.format}</Text>
        )}

        <Image src={props.imageRef} boxSize="32px" />
      </HStack>
      <HStack spacing='8px' placeContent={'flex-end'} pr={'40px'}>
        {store.number.loading || tokenPriceUSD.get().loading || currencies.loading.value  ? (
          <Skeleton maxH={'30px'} minW={'25%'} maxW={'50%'}><Text>Workaround</Text></Skeleton>
        ) : (
          <Text fontSize='medium'>{currencies.currencyConfigs.get(currencies.currency.value).symbol}{tokenPriceUSD.get().format}</Text>
        )}
      </HStack>
    </VStack>
  );
});

