import { useCallback, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { TextInput, Button, HelperText, Text, Menu, Surface } from 'react-native-paper';
import { Formik } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import ActivityIndicatorComponent from '../../components/ActivityIndicadorComponent';
import toDoListService from '../../services/toDoListService';

const STATUS_OPTIONS = ['CONCLUIDA', 'PENDENTE', 'EM_ANDAMENTO', 'CANCELADA'];
const PRIORITY_OPTIONS = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];

export default function EditTaskScreen({ navigation, route }) {
  const [idUser, setIdUser] = useState('');
  const [token, setToken] = useState('');
  const [initialValues, setInitialValues] = useState(null);
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
  const [categoriesMenuVisible, setCategoriesMenuVisible] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [categories, setCategories] = useState([]);

  const openStatusMenu = () => setStatusMenuVisible(true);
  const closeStatusMenu = () => setStatusMenuVisible(false);
  const openPriorityMenu = () => setPriorityMenuVisible(true);
  const closePriorityMenu = () => setPriorityMenuVisible(false);
  const openCategoriesMenu = () => setCategoriesMenuVisible(true);
  const closeCategoriesMenu = () => setCategoriesMenuVisible(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const idUser = await AsyncStorage.getItem('@userId');
        const tokenStorage = await AsyncStorage.getItem('@token');
        if (idUser && tokenStorage) {
          setIdUser(idUser);
          setToken(tokenStorage);
          await fetchCategories(tokenStorage);
          await getTaskById(tokenStorage, route.params.idTask);
        }
      };
      fetchData();
    }, [])
  );

  const fetchCategories = async (tk) => {
    try {
      const response = await toDoListService.get('/categories', {
        headers: {
          Authorization: `Bearer ${tk}`,
          'Content-Type': 'application/json',
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias', error);
    }
  };

  const getTaskById = async (tk, idTask) => {
    try {
      setActivityIndicator(false);
      const response = await toDoListService.get(`/tasks/${idTask}`, {
        headers: {
          Authorization: `Bearer ${tk}`,
          'Content-Type': 'application/json',
        }
      });

      const task = response.data;

      // GET NAME CATEGORY
      const nameCategory = await getNomeCategory(tk, task.category_id)
      setSelectedCategoryName(nameCategory);


      // FORMAT DateLimit
      const [year, month, day] = task.dateLimit.split('-');
      task.dateLimit = `${day}/${month}/${year}`;

      setInitialValues({
        titleTask: task.titleTask || '',
        descriptionTask: task.descriptionTask || '',
        statusTask: task.statusTask || '',
        priorityTask: task.priorityTask || '',
        dateLimit: task.dateLimit || '',
        user_id: task.user_id || '',
        category_id: task.category_id || '',
      });

    } catch (error) {
      alert("Erro ao buscar tarefa", error)
      console.log(error);
    } finally {
      setActivityIndicator(true);
    }
  };

  // GET NAME CATEGORY
  const getNomeCategory = async (tk, category_id) => {
    try {
      const nameCategory = await toDoListService.get(`categories/${category_id}`, {
        headers: {
          Authorization: `Bearer ${tk}`,
          'Content-Type': 'application/json',
        }
      })
      return nameCategory.data.nameCategory
    } catch (error) {
      alert("Erro ao buscar Nome da categoria")
    }
  }

  const updateTask = async (values) => {
    try {
      // FORMAT DATE LIMIT
      const [day, month, year] = values.dateLimit.split('/');
      values.dateLimit = `${year}-${month}-${day}`;

      await toDoListService.put(`/tasks/${route.params.idTask}`, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Tarefa atualizada com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao atualizar tarefa', error);
    }
  };

  if (!activityIndicator || !initialValues) {
    return <ActivityIndicatorComponent />;
  }

  return (
    <Surface style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} />}
        keyboardShouldPersistTaps="handled"
      >
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={updateTask}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <View>
              <TextInput
                label="Título"
                mode="outlined"
                left={<TextInput.Icon icon={() => <Ionicons name="clipboard-outline" size={20} />} />}
                value={values.titleTask}
                onChangeText={handleChange('titleTask')}
                onBlur={handleBlur('titleTask')}
                error={touched.titleTask && !!errors.titleTask}
                style={styles.input}
              />
              <HelperText type="error" visible={touched.titleTask && !!errors.titleTask}>
                {errors.titleTask}
              </HelperText>

              <TextInput
                label="Descrição"
                mode="outlined"
                multiline
                left={<TextInput.Icon icon={() => <Ionicons name="document-text-outline" size={20} />} />}
                value={values.descriptionTask}
                onChangeText={handleChange('descriptionTask')}
                onBlur={handleBlur('descriptionTask')}
                error={touched.descriptionTask && !!errors.descriptionTask}
                style={styles.input}
              />
              <HelperText type="error" visible={touched.descriptionTask && !!errors.descriptionTask}>
                {errors.descriptionTask}
              </HelperText>

              <Menu
                visible={statusMenuVisible}
                onDismiss={closeStatusMenu}
                anchor={
                  <TextInput
                    label="Status"
                    mode="outlined"
                    value={values.statusTask}
                    onFocus={openStatusMenu}
                    showSoftInputOnFocus={false}
                    left={<TextInput.Icon icon="flag-outline" />}
                    style={styles.input}
                  />
                }
              >
                {STATUS_OPTIONS.map((option) => (
                  <Menu.Item
                    key={option}
                    onPress={() => {
                      setFieldValue('statusTask', option);
                      closeStatusMenu();
                    }}
                    title={option}
                  />
                ))}
              </Menu>
              <HelperText type="error" visible={touched.statusTask && !!errors.statusTask}>
                {errors.statusTask}
              </HelperText>

              <Menu
                visible={priorityMenuVisible}
                onDismiss={closePriorityMenu}
                anchor={
                  <TextInput
                    label="Prioridade"
                    mode="outlined"
                    value={values.priorityTask}
                    onFocus={openPriorityMenu}
                    showSoftInputOnFocus={false}
                    left={<TextInput.Icon icon="alert-circle-outline" />}
                    style={styles.input}
                  />
                }
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <Menu.Item
                    key={option}
                    onPress={() => {
                      setFieldValue('priorityTask', option);
                      closePriorityMenu();
                    }}
                    title={option}
                  />
                ))}
              </Menu>
              <HelperText type="error" visible={touched.priorityTask && !!errors.priorityTask}>
                {errors.priorityTask}
              </HelperText>

              <TextInput
                label="Data Limite (DD-MM-AAAA)"
                mode="outlined"
                left={<TextInput.Icon icon="calendar-outline" />}
                value={values.dateLimit}
                onChangeText={handleChange('dateLimit')}
                onBlur={handleBlur('dateLimit')}
                error={touched.dateLimit && !!errors.dateLimit}
                style={styles.input}
                keyboardType='numeric'
                render={(props) => (
                  <TextInputMask
                    {...props}
                    type={'datetime'}
                    options={{ format: 'DD/MM/YYYY' }}
                  />
                )}
              />
              <HelperText type="error" visible={touched.dateLimit && !!errors.dateLimit}>
                {errors.dateLimit}
              </HelperText>

              <Menu
                visible={categoriesMenuVisible}
                onDismiss={closeCategoriesMenu}
                anchor={
                  <TextInput
                    label="Categorias"
                    mode="outlined"
                    value={selectedCategoryName}
                    onFocus={openCategoriesMenu}
                    showSoftInputOnFocus={false}
                    left={<TextInput.Icon icon="layers-outline" />}
                    style={styles.input}
                  />
                }
              >
                {categories.map((option) => (
                  <Menu.Item
                    key={option.id}
                    onPress={() => {
                      setFieldValue('category_id', option.id);
                      setSelectedCategoryName(option.nameCategory);
                      closeCategoriesMenu();
                    }}
                    title={option.nameCategory}
                  />
                ))}
              </Menu>
              <HelperText type="error" visible={touched.category_id && !!errors.category_id}>
                {errors.category_id}
              </HelperText>

              <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                Atualizar Tarefa
              </Button>
              <Button mode="contained-tonal" onPress={() => navigation.goBack()} style={styles.button}>
                Voltar
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  input: {
    marginTop: 0,
    marginBottom: 0, // Reduzido para tirar o espaçamento entre os inputs
    backgroundColor: 'white',
  },
  button: {
    marginTop: 10,
  },
});