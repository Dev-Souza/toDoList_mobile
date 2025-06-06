import React, { useState } from 'react';
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

export default function NewCategoryScreen() {
  const navigation = useNavigation();
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [visibleColorMenu, setVisibleColorMenu] = useState(false);
  const [visibleTypeMenu, setVisibleTypeMenu] = useState(false);

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
    corCategoryEnum: Yup.string().required('Cor é obrigatória'),
    tipoCategoryEnum: Yup.string().required('Tipo é obrigatório'),
  });

  const createCategory = async (values) => {
    try {
      setActivityIndicator(true)
      console.log(values)
      const response = await toDoListService.post("categories", values)
      setActivityIndicator(false)
      alert('Categoria criada com sucesso!');
      // navigation.navigate('ListCategoriesScreen');
    } catch (error) {
      alert("Erro ao cadastrar categoria!", error);
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nova Categoria</Text>

      <Formik
        initialValues={{
          nameCategory: '',
          descriptionCategory: '',
          corCategoryEnum: '',
          tipoCategoryEnum: '',
          user: '',
        }}
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
                  <TouchableWithoutFeedback onPress={() => setVisibleColorMenu(true)}>
                    <View pointerEvents="box-only">
                      <TextInput
                        mode="outlined"
                        label="Selecionar cor"
                        value={values.corCategoryEnum}
                        editable={false}
                        style={styles.input}
                        right={<TextInput.Icon icon="chevron-down" />}
                        error={touched.corCategoryEnum && !!errors.corCategoryEnum}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                }
              >
                {colorOptions.map((color) => (
                  <Menu.Item
                    key={color}
                    onPress={() => {
                      setFieldValue('corCategoryEnum', color);
                      setVisibleColorMenu(false);
                    }}
                    title={color}
                  />
                ))}
              </Menu>
              <HelperText type="error" visible={touched.corCategoryEnum && !!errors.corCategoryEnum}>
                {errors.corCategoryEnum}
              </HelperText>
            </View>

            {/* Menu de Tipo */}
            <View style={styles.menuContainer}>
              <Menu
                visible={visibleTypeMenu}
                onDismiss={() => setVisibleTypeMenu(false)}
                anchor={
                  <TouchableWithoutFeedback onPress={() => setVisibleTypeMenu(true)}>
                    <View pointerEvents="box-only">
                      <TextInput
                        mode="outlined"
                        label="Selecionar tipo"
                        value={values.tipoCategoryEnum}
                        editable={false}
                        style={styles.input}
                        right={<TextInput.Icon icon="chevron-down" />}
                        error={touched.tipoCategoryEnum && !!errors.tipoCategoryEnum}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                }
              >
                {typeOptions.map((type) => (
                  <Menu.Item
                    key={type}
                    onPress={() => {
                      setFieldValue('tipoCategoryEnum', type);
                      setVisibleTypeMenu(false);
                    }}
                    title={type}
                  />
                ))}
              </Menu>
              <HelperText type="error" visible={touched.tipoCategoryEnum && !!errors.tipoCategoryEnum}>
                {errors.tipoCategoryEnum}
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