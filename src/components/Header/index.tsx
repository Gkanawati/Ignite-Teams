import { Container, Logo, BackButton, BackIcon } from './styles';

import logoImg from '@assets/logo.png';
import { useNavigation } from '@react-navigation/native';

interface Props {
  showBackButton?: boolean;
}

export function Header({ showBackButton = false }: Props) {
  const { navigate } = useNavigation();

  return (
    <Container>
      {showBackButton && (
        <BackButton onPress={() => navigate('groups')}>
          <BackIcon />
        </BackButton>
      )}
      <Logo source={logoImg} />
    </Container>
  );
}
