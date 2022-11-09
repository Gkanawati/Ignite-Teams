import { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { groupsGetAll } from '@storage/group/groupsGetAll';
import { Button } from '@components/Button';
import { Header } from '@components/Header';
import { GroupCard } from '@components/GroupCard';
import { Highlight } from '@components/Highlight';
import { ListEmpty } from '@components/ListEmpty';
import { Container, ContentContainer } from './styles';

export function Groups() {
  const [groups, setGroups] = useState<string[]>([]);
  const [loadingRefresh, setLoadingRefresh] = useState(false);

  const theme = useTheme();

  const { navigate } = useNavigation();

  async function fetchGroups() {
    setLoadingRefresh(true);
    try {
      const data = await groupsGetAll();
      setGroups(data.reverse());
    } catch (error) {
      console.log('fetchGroups ~ error', error);
      Alert.alert('Turmas', 'Não foi possível carregar as turmas.');
    } finally {
      setLoadingRefresh(false);
    }
  }
  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  return (
    <Container>
      <ContentContainer>
        <Header />
        <Highlight title='Turmas' subtitle='Jogue com a sua turma' />
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <GroupCard
              title={item}
              onPress={() => navigate('players', { group: item })}
            />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={() => (
            <ListEmpty message='Que tal cadastrar a primeira turma?' />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor={theme.COLORS.GRAY_200}
              colors={[theme.COLORS.GREEN_700, theme.COLORS.GRAY_700]}
              refreshing={loadingRefresh}
              onRefresh={() => fetchGroups()}
            />
          }
        />

        <Button title='Criar nova turma' onPress={() => navigate('new')} />
      </ContentContainer>
    </Container>
  );
}
