import { useCallback, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { TextInput, Button, HelperText, Text, Menu, Surface } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import ActivityIndicatorComponent from '../../../components/ActivityIndicadorComponent';
import toDoListService from '../../../services/toDoListService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';

const STATUS_OPTIONS = ['CONCLUIDA', 'PENDENTE', 'EM_ANDAMENTO', 'CANCELADA'];
const PRIORITY_OPTIONS = ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE'];

const validationSchema = Yup.object().shape({
  titleTask: Yup.string().required('Título é obrigatório'),
  descriptionTask: Yup.string().required('Descrição é obrigatória'),
  statusTask: Yup.string().required('Status é obrigatório'),
  priorityTask: Yup.string().required('Prioridade é obrigatória'),
  dateLimit: Yup.string().required('Data limite é obrigatória'),
  category_id: Yup.string().required('Categoria é obrigatória'),
});

export default function NewTaskScreen({ navigation }) {
  // STATE THE USER
  const [idUser, setIdUser] = useState('');
  // STATE THE TOKEN
  const [token, setToken] = useState('');
  // STATE THE CATEGORIES
  const [categories, setCategories] = useState([]);
  // State the loading
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
  // MENU THE CATEGORIES
  const [categoriesMenuVisible, setCategoriesMenuVisible] = useState(false);

  // Estado para mostrar nome da categoria no campo (apenas exibição)
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        // ZERANDO CAMPO DE NOME CATEGORY
        setSelectedCategoryName('');
        const idUser = await AsyncStorage.getItem('@userId');
        const tokenStorage = await AsyncStorage.getItem('@token');
        if (idUser && tokenStorage) {
          setIdUser(idUser);
          setToken(tokenStorage);
          getCategories(tokenStorage, idUser);
        }
      };
      fetchData();
    }, [])
  );

  // GET CATEGORIES
  const getCategories = async (tk, id) => {
    try {
      setActivityIndicator(true);
      const response = await toDoListService.get(`categories/users/${id}`, {
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getCategories(token, idUser).finally(() => setRefreshing(false));
  }, [token, idUser]);

  const openStatusMenu = () => setStatusMenuVisible(true);
  const closeStatusMenu = () => setStatusMenuVisible(false);
  const openPriorityMenu = () => setPriorityMenuVisible(true);
  const closePriorityMenu = () => setPriorityMenuVisible(false);
  // MENU CATEGORIES
  const openCategoriesMenu = () => setCategoriesMenuVisible(true);
  const closeCategoriesMenu = () => setCategoriesMenuVisible(false);

  // FUNCTION CREATE TASKS
  const createTask = async (values) => {
    try {
      console.log("ID USER: " + values.user_id);
      console.log("ID CATEGORY: " + values.category_id)
      setActivityIndicator(true)
      // DATA PATTERN EUA
      const [day, month, year] = values.dateLimit.split('/');
      values.dateLimit = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const response = await toDoListService.post(`tasks`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      console.log(response.data)
      alert("Tarefa cadastrada com sucesso");
      navigation.navigate('MainScreen');
    } catch (error) {
      alert("Erro ao cadastrar tarefa!", error);
      console.log(error);
    } finally {
      setActivityIndicator(false)
    }
  };

  // LOADING
  if (activityIndicator) {
    return <ActivityIndicatorComponent />;
  }

  return (
    <Surface style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps="handled"
      >
        <Formik
          initialValues={{
            titleTask: '',
            descriptionTask: '',
            statusTask: '',
            priorityTask: '',
            dateLimit: '',
            user_id: idUser,
            category_id: '',
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values) => {
            createTask(values);
          }}
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

              {/* Select Status */}
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

              {/* Select Prioridade */}
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
                    options={{
                      format: 'DD/MM/YYYY'
                    }}
                  />
                )}
              />
              <HelperText type="error" visible={touched.dateLimit && !!errors.dateLimit}>
                {errors.dateLimit}
              </HelperText>

              {/* SELECT CATEGORIES */}
              <Menu
                visible={categoriesMenuVisible}
                onDismiss={closeCategoriesMenu}
                anchor={
                  <TextInput
                    label="Categorias"
                    mode="outlined"
                    value={selectedCategoryName}  // mostra o nome no campo
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
                      setFieldValue('category_id', option.id);  // salva só o ID no formik
                      setSelectedCategoryName(option.nameCategory);  // salva nome para mostrar
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
                Criar Tarefa
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 2,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 0,
  },
});