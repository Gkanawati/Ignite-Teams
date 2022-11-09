import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppError } from '@utils/AppError';
import { groupCreate } from '@storage/group/groupCreate';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Container, Content, ContentContainer, Icon } from './styles';

export function NewGroup() {
  const [group, setGroup] = useState('');
  const { navigate } = useNavigation();

  function TrimNameGroup(nameGroup: string) {
    setGroup(group.trim());
    return nameGroup.trim();
  }

  async function handleAddGroup() {
    const response = TrimNameGroup(group);
    if (!response) {
      return Alert.alert('Nova Turma', 'Informe um nome para criar a  turma');
    }
    try {
      await groupCreate(group);
      navigate('players', { group });
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova Turma', error.message);
      } else {
        Alert.alert('Nova Turma', 'Não foi possível criar uma nova turma.');
        throw error;
      }
    }
  }

  return (
    <Container>
      <ContentContainer>
        <Header showBackButton />

        <Content>
          <Icon />
          <Highlight
            title='Nova Turma'
            subtitle='crie a turma para adicionar as pessoas'
          />
          <Input
            value={group}
            placeholder='Nome da turma'
            onChangeText={setGroup}
            onSubmitEditing={() => handleAddGroup()}
            returnKeyType='done'
          />
          <Button
            title='Criar'
            style={{ marginTop: 20 }}
            onPress={() => handleAddGroup()}
          />
        </Content>
      </ContentContainer>
    </Container>
  );
}
