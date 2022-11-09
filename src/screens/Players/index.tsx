import { useEffect, useState, useRef } from 'react';
import { Alert, FlatList, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppError } from '@utils/AppError';
import { PlayerAddByGroup } from '@storage/player/PlayerAddByGroup';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';
import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { Button } from '@components/Button';
import { Header } from '@components/Header';
import { Loading } from '@components/Loading';
import { ListEmpty } from '@components/ListEmpty';
import { Highlight } from '@components/Highlight';
import { ButtonIcon } from '@components/ButtonIcon';
import { PlayerCard } from '@components/PlayerCard';

import {
  Container,
  ContentContainer,
  Form,
  HeaderList,
  NumberOfPlayers,
} from './styles';

type RouteParams = {
  group: string;
};

export function Players() {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { navigate } = useNavigation();

  const route = useRoute();
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  function TrimPlayerName(newPlayerName: string) {
    setNewPlayerName(newPlayerName.trim());
    return newPlayerName.trim();
  }

  async function handleRemovePlayer(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      Alert.alert('Remover Pessoa', 'Nao foi possível remover essa pessoa.');
      console.log('handleRemovePlayer:', error);
      throw error;
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigate('groups');
    } catch (error) {
      console.log('groupRemove ~ error', error);
      Alert.alert('Remover a turma', 'Não foi possível remover a turma.');
    }
  }

  async function handleRemoveGroup() {
    Alert.alert('Remover Turma', 'Tem certeza que deseja remover a turma?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => groupRemove() },
    ]);
  }

  async function fetchPlayersByTeam() {
    try {
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
      setIsLoading(false);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddPlayer(newPlayerName: string) {
    const response = TrimPlayerName(newPlayerName);
    if (!response) {
      return Alert.alert(
        'Nova pessoa',
        'Informe o nome da pessoa para adicionar.'
      );
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    };

    try {
      await PlayerAddByGroup(newPlayer, group);
      fetchPlayersByTeam();
      newPlayerNameInputRef.current?.blur();
      setNewPlayerName('');
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova pessoa', error.message);
      } else {
        console.log(error);
        Alert.alert('Nova pessoa', 'Não foi possível adicionar');
        throw error;
      }
    }
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <ContentContainer>
        <Header showBackButton />
        <Highlight
          title={group}
          subtitle='adicione a galera e separe os times'
        />

        <Form>
          <Input
            inputRef={newPlayerNameInputRef}
            value={newPlayerName}
            placeholder='Nome da pessoa'
            autoCorrect={false}
            onChangeText={setNewPlayerName}
            onSubmitEditing={() => handleAddPlayer(newPlayerName)}
            returnKeyType='done'
          />
          <ButtonIcon
            icon='add'
            onPress={() => handleAddPlayer(newPlayerName)}
          />
        </Form>

        <HeaderList>
          <FlatList
            data={['Time A', 'Time B']}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Filter
                title={item}
                isActive={item === team}
                onPress={() => setTeam(item)}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
          <NumberOfPlayers>{players.length}</NumberOfPlayers>
        </HeaderList>

        {!isLoading ? (
          <FlatList
            data={players}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <PlayerCard
                name={item.name}
                onRemove={() => handleRemovePlayer(item.name)}
              />
            )}
            ListEmptyComponent={() => (
              <ListEmpty message='Não há pessoas nesse time' />
            )}
            contentContainerStyle={[
              players.length ? { paddingBottom: 100 } : { flex: 1 },
            ]}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Loading />
        )}

        <Button
          title='Remover turma'
          type='SECONDARY'
          onPress={() => handleRemoveGroup()}
        />
      </ContentContainer>
    </Container>
  );
}
