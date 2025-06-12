import { StyleSheet, View, ScrollView } from 'react-native';
import { Avatar, Text, Button, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ActivityIndicatorComponent from '../../components/ActivityIndicadorComponent';
import toDoListService from '../../services/toDoListService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PerfilScreen({ navigation }) {
  // STATE ID USER
  const [idUser, setIdUser] = useState('');
  // STATE TOKEN
  const [token, setToken] = useState('');
  // STATE LOADING
  const [activityIndicator, setActivityIndicator] = useState(false);
  // STATE USER
  const [user, setUser] = useState({})

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const tokenStorage = await AsyncStorage.getItem('@token');
        const idUserStorage = await AsyncStorage.getItem('@userId');
        if (tokenStorage && idUserStorage) {
          setToken(tokenStorage);
          setIdUser(idUserStorage);
          // GET USER BY ID
          await getUserById(tokenStorage, idUserStorage);
        }
      };
      loadData();
    }, [])
  );

  // FUNCTION GET USER BY ID
  const getUserById = async (tokenStorage, idUserStorage) => {
    try {
      setActivityIndicator(true);
      const userResponse = await toDoListService.get(`users/${idUserStorage}`, {
        headers: {
          Authorization: `Bearer ${tokenStorage}`,
          'Content-Type': 'application/json',
        }
      })
      // Formatted pattern photo perfil
      userResponse.data.fotoPerfil = 'http://192.168.1.128:8080/uploads/' + userResponse.data.fotoPerfil;
      setUser(userResponse.data);
    } catch (error) {
      alert("Erro ao carregar user!", error);
      console.log(error);
    } finally {
      setActivityIndicator(false)
    }
  }

  // LOADING
  if (activityIndicator) return <ActivityIndicatorComponent />;
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar.Image
          size={140}
          source={{ uri: user.fotoPerfil }}
          style={styles.avatar}

        />
        <Title style={styles.username}>{user.userName}</Title>
        <Text style={styles.email}>{user.email}</Text>
        <Button
          icon="pencil-outline"
          mode="contained-tonal"
          onPress={() => navigation.navigate('EditPerfilScreen', {idUser: user.id})}
          style={styles.editButton}
        >
          Editar Perfil
        </Button>
      </View>
      <Card style={styles.detailsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Informações de Contato</Title>
          <Divider style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={24} color="#555" style={styles.infoIcon} />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#555" style={styles.infoIcon} />
            <Text style={styles.infoText}>Nível de Acesso: {user.role}</Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    marginBottom: 10,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: '#e0e0e0',
  },
  username: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  editButton: {
    width: '60%',
  },
  detailsCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    marginBottom: 10,
    fontSize: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  infoIcon: {
    marginRight: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
  },
  divider: {
    marginVertical: 5,
  }
});