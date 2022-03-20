import React from 'react';
import { IconProps, Image } from '@chakra-ui/react';

export const Logo = (props: IconProps) => {

  return (
    <Image src='images/spartans.png' boxSize="80px" {...props} />
  );
};

export const DarkLogo = (props: IconProps) => {

  return (
    <Image src='images/dark-spartans.png' boxSize="80px" {...props} />
  );
};
