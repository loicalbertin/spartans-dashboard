import { Dashboard } from '@/components/Dashboard';
import { Container } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';

export const Home = observer(() => {

  return (
    <Container maxW="7xl">
      <Dashboard />
    </Container>
  );
});

export default Home;
