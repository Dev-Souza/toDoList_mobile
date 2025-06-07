import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toDoListService from '../../services/toDoListService';
import ActivityIndicatorComponent from '../../components/ActivityIndicadorComponent';
import { useFocusEffect } from '@react-navigation/native';

// Mapeamento das cores em português para códigos hexadecimais
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

export default function ListCategoriesScreen({ navigation }) {
  const [token, setToken] = useState('');
  const [categories, setCategories] = useState([]);
  const [activityIndicator, setActivityIndicator] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const tokenStorage = await AsyncStorage.getItem('@token');
        if (tokenStorage) {
          setToken(tokenStorage);
          await getCategories(tokenStorage);
        }
      };
      loadData();
    }, [])
  );

  const getCategories = async (tk) => {
    try {
      setActivityIndicator(true);
      const response = await toDoListService.get('categories', {
        headers: {
          Authorization: `Bearer ${tk}`,
          'Content-Type': 'application/json',
        },
      });
      setCategories(response.data);
    } catch (error) {
      alert('Erro ao buscar categorias!');
      console.log(error);
    } finally {
      setActivityIndicator(false);
    }
  };

  // FUNCTION THE DELETE
  const handleDelete = async (itemId) => {
    try {
      setActivityIndicator(true);

      const response = await toDoListService.delete(`categories/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log(response.data);
      alert("Categoria excluída com sucesso!");

      // Recarrega as categorias
      await getCategories(token);

    } catch (error) {
      alert("Erro ao excluir categoria");
      console.log(error);
    } finally {
      setActivityIndicator(false);
    }
  };

  // ALERT THE CONFIRM
  const confirmDelete = (itemId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta categoria?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: () => handleDelete(itemId),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  if (activityIndicator) return <ActivityIndicatorComponent />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Categorias</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.categoryItem,
              { borderLeftColor: colorMap[item.corCategory] || '#000' },
            ]}
          >
            <Text style={styles.categoryName}>{item.nameCategory}</Text>
            <Text style={styles.categoryDescription}>{item.descriptionCategory}</Text>
            <View style={styles.tagContainer}>
              <Text style={styles.tag}>{item.tipoCategory}</Text>
            </View>

            {/* Botões de ação */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={() => navigation.navigate('EditCategoryScreen', item.id)}
              >
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => confirmDelete(item.id)}
              >
                <Text style={styles.actionText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma categoria encontrada.</Text>
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
  categoryItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderLeftWidth: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryDescription: {
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
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 16,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#1E90FF',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});