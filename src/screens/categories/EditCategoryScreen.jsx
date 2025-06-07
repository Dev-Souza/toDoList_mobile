import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  Text,
  Menu,
} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import toDoListService from '../../services/toDoListService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ActivityIndicatorComponent from '../../components/ActivityIndicadorComponent';

export default function EditCategoriaScreen({ navigation, route }) {
  const [activityIndicator, setActivityIndicator] = useState(true);
  const [token, setToken] = useState('');
  const [category, setCategory] = useState({});
  const [visibleColorMenu, setVisibleColorMenu] = useState(false);
  const [visibleTypeMenu, setVisibleTypeMenu] = useState(false);

  const colorOptions = ['VERMELHO', 'AZUL', 'VERDE', 'AMARELO', 'LARANJA', 'ROXO', 'ROSA', 'CINZA', 'PRETO'];
  const typeOptions = ['PESSOAL', 'PROFISSIONAL', 'ESTUDOS', 'SAUDE', 'FINANCAS', 'LAZER', 'CASA', 'VIAGEM', 'COMPRAS', 'OUTROS'];

  const validationSchema = Yup.object().shape({
    nameCategory: Yup.string().required('Nome é obrigatório'),
    descriptionCategory: Yup.string().required('Descrição é obrigatória'),
    corCategory: Yup.string().required('Cor é obrigatória'),
    tipoCategory: Yup.string().required('Tipo é obrigatório'),
  });

  useEffect(() => {
    const fetchData = async () => {
      const tokenStorage = await AsyncStorage.getItem('@token');
      if (tokenStorage) {
        setToken(tokenStorage);
        getCategoryById(tokenStorage);
      }
    };
    fetchData();
  }, []);

  const getCategoryById = async (tk) => {
    try {
      const idCategory = route.params;
      const response = await toDoListService.get(`categories/${idCategory}`, {
        headers: {
          Authorization: `Bearer ${tk}`,
          'Content-Type': 'application/json',
        },
      });
      setCategory(response.data);
    } catch (error) {
      alert("Erro ao buscar categoria!");
      console.log(error);
    } finally {
      setActivityIndicator(false);
    }
  };

  const updateCategory = async (values) => {
    try {
      setActivityIndicator(true);
      const idCategory = route.params;
      console.log("ID Catgoria: " + idCategory)
      await toDoListService.put(`categories/${idCategory}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      alert("Categoria atualizada com sucesso!");
      navigation.goBack();
    } catch (error) {
      alert("Erro ao atualizar categoria!");
      console.log(error);
    } finally {
      setActivityIndicator(false);
    }
  };

  if (activityIndicator) return <ActivityIndicatorComponent />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Categoria</Text>

      <Formik
        initialValues={{
          nameCategory: category.nameCategory || '',
          descriptionCategory: category.descriptionCategory || '',
          corCategory: category.corCategory || '',
          tipoCategory: category.tipoCategory || '',
          user_id: category.user_id
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={updateCategory}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View>
            <TextInput
              label="Nome da Categoria"
              mode="outlined"
              left={<TextInput.Icon icon="label-outline" />}
              value={values.nameCategory}
              onChangeText={handleChange('nameCategory')}
              onBlur={handleBlur('nameCategory')}
              error={touched.nameCategory && !!errors.nameCategory}
              style={styles.input}
            />
            <HelperText type="error" visible={touched.nameCategory && !!errors.nameCategory}>
              {errors.nameCategory}
            </HelperText>

            <TextInput
              label="Descrição"
              mode="outlined"
              left={<TextInput.Icon icon="text" />}
              value={values.descriptionCategory}
              onChangeText={handleChange('descriptionCategory')}
              onBlur={handleBlur('descriptionCategory')}
              error={touched.descriptionCategory && !!errors.descriptionCategory}
              multiline
              style={styles.input}
            />
            <HelperText type="error" visible={touched.descriptionCategory && !!errors.descriptionCategory}>
              {errors.descriptionCategory}
            </HelperText>

            {/* Menu de Cor */}
            <View style={styles.menuContainer}>
              <Menu
                visible={visibleColorMenu}
                onDismiss={() => setVisibleColorMenu(false)}
                anchor={
                  <TouchableWithoutFeedback onPress={() => {
                    setVisibleColorMenu(true);
                    setVisibleTypeMenu(false);
                  }}>
                    <View pointerEvents="box-only">
                      <TextInput
                        mode="outlined"
                        label="Selecionar cor"
                        value={values.corCategory}
                        editable={false}
                        style={styles.input}
                        right={<TextInput.Icon icon="chevron-down" />}
                        error={touched.corCategory && !!errors.corCategory}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                }
              >
                {colorOptions.map((color) => (
                  <Menu.Item
                    key={color}
                    onPress={() => {
                      setFieldValue('corCategory', color);
                      setVisibleColorMenu(false);
                    }}
                    title={color}
                  />
                ))}
              </Menu>
              <HelperText type="error" visible={touched.corCategory && !!errors.corCategory}>
                {errors.corCategory}
              </HelperText>
            </View>

            {/* Menu de Tipo */}
            <View style={styles.menuContainer}>
              <Menu
                visible={visibleTypeMenu}
                onDismiss={() => setVisibleTypeMenu(false)}
                anchor={
                  <TouchableWithoutFeedback onPress={() => {
                    setVisibleTypeMenu(true);
                    setVisibleColorMenu(false);
                  }}>
                    <View pointerEvents="box-only">
                      <TextInput
                        mode="outlined"
                        label="Selecionar tipo"
                        value={values.tipoCategory}
                        editable={false}
                        style={styles.input}
                        right={<TextInput.Icon icon="chevron-down" />}
                        error={touched.tipoCategory && !!errors.tipoCategory}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                }
              >
                {typeOptions.map((type) => (
                  <Menu.Item
                    key={type}
                    onPress={() => {
                      setFieldValue('tipoCategory', type);
                      setVisibleTypeMenu(false);
                    }}
                    title={type}
                  />
                ))}
              </Menu>
              <HelperText type="error" visible={touched.tipoCategory && !!errors.tipoCategory}>
                {errors.tipoCategory}
              </HelperText>
            </View>

            <Button
              mode="contained"
              icon="content-save-outline"
              onPress={handleSubmit}
              style={styles.button}
            >
              Salvar Alterações
            </Button>
            <Button
              mode="contained-tonal"
              icon="content-save-outline"
              onPress={() => navigation.goBack()}
              style={styles.button}
            >
              Voltar
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  menuContainer: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
});