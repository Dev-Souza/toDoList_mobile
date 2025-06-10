import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivityIndicatorComponent from '../../components/ActivityIndicadorComponent';
import toDoListService from '../../services/toDoListService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colorMap = {
  AMARELO: '#FFD700',
  VERDE: '#32CD32',
  AZUL: '#1E90FF',
  VERMELHO: '#FF6347',
  LARANJA: '#FFA500',
  ROXO: '#8A2BE2',
  PRETO: '#000000',
  BRANCO: '#FFFFFF',
  CINZA: '#808080',
};

export default function EmAndamentoScreen({navigation}) {
  // STATE TASKS
  const [tasks, setTasks] = useState([]);
  // STATE TOKEN
  const [token, setToken] = useState('');
  // STATE ID USER
  const [idUser, setIdUser] = useState('');
  // STATE LOADING
  const [activityIndicator, setActivityIndicator] = useState(false);
  // COLOR CATEGORY
  const [categoryColors, setCategoryColors] = useState({});

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const tokenStorage = await AsyncStorage.getItem('@token');
        const idUserStorage = await AsyncStorage.getItem('@userId');
        if (tokenStorage && idUserStorage) {
          setToken(tokenStorage);
          setIdUser(idUserStorage);
          // CHAMANDO A FUNCTION DE TASKS
          await getTasks(tokenStorage, idUserStorage);
        }
      };
      loadData();
    }, [])
  );

  // GET ALL TASKS BY STATUS AND USER
  const getTasks = async (token, idUser) => {
    try {
      setActivityIndicator(true);
      const response = await toDoListService.get(`tasks/filter/EM_ANDAMENTO/${idUser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      setTasks(response.data);

      // Carrega as cores das categorias das tasks, apenas uma vez por categoria
      const uniqueCategoryIds = [...new Set(response.data.map(task => task.category_id))];

      const colorsObj = { ...categoryColors };

      await Promise.all(
        uniqueCategoryIds.map(async (categoryId) => {
          if (!colorsObj[categoryId]) {
            const color = await getColorCategory(token ,categoryId);
            colorsObj[categoryId] = color;
          }
        })
      );
      setCategoryColors(colorsObj);
    } catch (error) {
      alert("Erro ao buscar tasks");
      console.log(error);
    } finally {
      setActivityIndicator(false);
    }
  };

  // GET COLOR CATEGORY
  const getColorCategory = async (tk, category_id) => {
    try {
      const response = await toDoListService.get(`categories/color/${category_id}`, {
        headers: {
          Authorization: `Bearer ${tk}`,
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleMarkAsComplete = (itemId) => {
    console.log('Marcar como concluído:', itemId);
  };

  // EDITAR TASK
  const handleEdit = (idTask) => {
    navigation.navigate('EditEmAndamento', {idTask: idTask});
  };

  const handleDelete = async (itemId) => {
    try {
      setActivityIndicator(true);
      const responseDelete = await toDoListService.delete(`tasks/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      alert("Tarefa em andamento excluída com sucesso!");
    } catch (error) {
      alert("Erro ao excluir tarefa em andamento!" + error)
      console.log(error);
    } finally {
      setActivityIndicator(false);
      // GET ALL TASKS
      getTasks(token, idUser);
    }
  };

  if (activityIndicator) return <ActivityIndicatorComponent />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Andamentos</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={[
            styles.pendingCard,
            { borderLeftColor: colorMap[categoryColors[item.category_id]] || '#000' }
          ]}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Title style={styles.pendingName}>{item.titleTask}</Title>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                  <Icon name="close" size={22} color={colorMap.VERMELHO} />
                </TouchableOpacity>
              </View>
              <Paragraph style={styles.pendingDescription}>{item.descriptionTask}</Paragraph>
              <View style={styles.tagContainer}>
                <Text style={styles.tag}>{item.priorityTask}</Text>
              </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
              <View style={styles.actionsWrapper}>
                <Button
                  icon="check"
                  mode="contained"
                  onPress={() => handleMarkAsComplete(item.id)}
                  style={styles.actionButton}
                  labelStyle={styles.actionButtonText}
                  theme={{ colors: { primary: colorMap.VERDE } }}
                >
                  Concluir
                </Button>
                <Button
                  icon="pencil"
                  mode="contained"
                  onPress={() => handleEdit(item.id)}
                  style={styles.actionButton}
                  labelStyle={styles.actionButtonText}
                  theme={{ colors: { primary: colorMap.AZUL } }}
                >
                  Editar
                </Button>
              </View>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum item em andamento encontrado.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  pendingCard: {
    marginBottom: 12,
    borderRadius: 10,
    borderLeftWidth: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  completedIcon: {
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  pendingDescription: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  tagContainer: {
    marginTop: 8,
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tag: {
    fontSize: 12,
    color: '#444',
  },
  cardActions: {
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  actionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  actionButton: {
    marginRight: 8,
    paddingHorizontal: 6,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 16,
  },
});