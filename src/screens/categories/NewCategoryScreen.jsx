import React, { useEffect, useState } from 'react';
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
import { Formik } from 'formik';
import * as Yup from 'yup';
import toDoListService from '../../services/toDoListService';
import { useNavigation } from '@react-navigation/native';
import ActivityIndicatorComponent from '../../components/ActivityIndicadorComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewCategoryScreen() {
  const navigation = useNavigation();
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [visibleColorMenu, setVisibleColorMenu] = useState(false);
  const [visibleTypeMenu, setVisibleTypeMenu] = useState(false);
  const [id, setId] = useState('');
  const [token, setToken] = useState('');

  const colorOptions = [
    'VERMELHO', 'AZUL', 'VERDE', 'AMARELO',
    'LARANJA', 'ROXO', 'ROSA', 'CINZA', 'PRETO',
  ];

  const typeOptions = [
    'PESSOAL', 'PROFISSIONAL', 'ESTUDOS', 'SAUDE',
    'FINANCAS', 'LAZER', 'CASA', 'VIAGEM', 'COMPRAS', 'OUTROS',
  ];

  const validationSchema = Yup.object().shape({
    nameCategory: Yup.string().required('Nome é obrigatório'),
    descriptionCategory: Yup.string().required('Descrição é obrigatória'),
    corCategory: Yup.string().required('Cor é obrigatória'),
    tipoCategory: Yup.string().required('Tipo é obrigatório'),
  });

  // Carregar id e token antes de mostrar o formulário
  useEffect(() => {
    const fetchData = async () => {
      const idUser = await AsyncStorage.getItem('@userId');
      const tokenStorage = await AsyncStorage.getItem('@token');

      if (idUser) setId(idUser);
      if (tokenStorage) setToken(tokenStorage);
    };
    fetchData();
  }, []);

  const createCategory = async (values) => {
    try {
      setActivityIndicator(true);
      const response = await toDoListService.post("categories", values, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      alert(`Categoria ${response.data.nameCategory} criada com sucesso!`);
      navigation.navigate('ListCategorias');
    } catch (error) {
      alert("Erro ao cadastrar categoria");
      console.log(error);
    } finally {
      setActivityIndicator(false);
    }
  };

  if (activityIndicator) {
    return <ActivityIndicatorComponent />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nova Categoria</Text>

      <Formik
        initialValues={{
          nameCategory: '',
          descriptionCategory: '',
          corCategory: '',
          tipoCategory: '',
          user_id: id, // já inicializa aqui
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          createCategory(values);
        }}
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
                    setVisibleTypeMenu(false); // fecha o outro menu, se aberto
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
                    setVisibleColorMenu(false); // fecha o outro menu, se aberto
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
              icon="plus-circle-outline"
              onPress={handleSubmit}
              style={styles.button}
            >
              Criar Categoria
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