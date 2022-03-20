import React from 'react';
import { ImageProps, Image } from '@chakra-ui/react';

export const Logo = (props: ImageProps) => {

  return (
    <Image src='images/spartans.png' boxSize="80px" {...props} />
  );
};

export const DarkLogo = (props: ImageProps) => {

  return (
    <Image src='images/dark-spartans.png' boxSize="80px" {...props} />
  );
};
