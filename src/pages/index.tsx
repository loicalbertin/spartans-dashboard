import { RewardsBoard } from '@/components/RewardsBoard';
import { useStore } from '@/store/index';
import { Badge, Text } from '@chakra-ui/layout';
import { Container, Link as ChakraLink, SimpleGrid, Stack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import React from 'react';
import { ToolConfig } from '../config/ToolConfig';

export const Home = observer(() => {
  const { lang } = useStore();


  return (
    <Container maxW="7xl">
      <RewardsBoard/>
    </Container>
  );
});

export default Home;
