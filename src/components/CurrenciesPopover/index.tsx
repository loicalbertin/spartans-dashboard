import { Button, Image, Popover, PopoverContent, PopoverTrigger, Portal, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React from 'react';
import { useStore } from '../../store/index';

export interface CurrenciesPopoverProps {
  addPortal?: boolean;
}

interface CurrenciesPopoverContentProps {
  onClose: () => void;
}

const CurrenciesPopoverContent = observer((props: CurrenciesPopoverContentProps) => {
  const { currencies } = useStore();
  return (
    <PopoverContent w="40" px="2" py="2">
      {[...currencies.currencyConfigs.values()].map((currencyConfig) => (
        <Button
          isActive={currencyConfig.currency === currencies.currency.value}
          bg={'none'}
          key={currencyConfig.currency}
          onClick={() => {
            props.onClose();
            currencies.currency.setValue(currencyConfig.currency);
            currencies.updateCurrency();
          }}
        >
          <Image src={`/images/${currencyConfig.image}`} boxSize="20px" />
          <Text ml="8px" fontSize="sm">
            {currencyConfig.name}
          </Text>
        </Button>
      )
      )}
    </PopoverContent>
  );
});

export const CurrenciesPopover = observer((props: CurrenciesPopoverProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const open = () => setIsOpen(!isOpen)
  const close = () => setIsOpen(false)
  const { currencies } = useStore();

  return (
    <Popover variant="hover" closeOnBlur autoFocus
      isOpen={isOpen}
      onClose={close}>

      <PopoverTrigger>
        <Button borderRadius="12" onClick={open}>
          <Image src={`/images/${currencies.currencyConfigs.get(currencies.currency.value).image}`} boxSize="20px" />
        </Button>
      </PopoverTrigger>
      {props.addPortal ? (
        <Portal>
          <CurrenciesPopoverContent onClose={close} />
        </Portal>
      ) : (
        <CurrenciesPopoverContent onClose={close} />
      )}


    </Popover>
  );
});
