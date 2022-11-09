import { TouchableOpacityProps } from 'react-native';
import { Container, Icon, Title } from './styles';

interface TypeProps extends TouchableOpacityProps {
  title: string;
}

export function GroupCard({ title, ...rest }: TypeProps) {
  return (
    <Container {...rest}>
      <Icon />
      <Title>{title}</Title>
    </Container>
  );
}
