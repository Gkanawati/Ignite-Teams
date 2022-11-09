import { Container, Message } from './styles';

interface MessageProps {
  message: string;
}

export function ListEmpty({ message }: MessageProps) {
  return (
    <Container>
      <Message>{message}</Message>
    </Container>
  );
}
