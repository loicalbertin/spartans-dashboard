import { RewardsBoard } from '@/components/RewardsBoard';
import { useStore } from '@/store/index';
import { Container } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React from 'react';

export const Home = observer(() => {
  const { lang } = useStore();


  return (
    <Container maxW="7xl">
      <RewardsBoard/>
    </Container>
  );
});

export default Home;
