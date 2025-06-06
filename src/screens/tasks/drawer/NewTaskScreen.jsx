import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { TextInput, Button, HelperText, Text, Menu } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

const COLOR_OPTIONS = [
  'VERMELHO', 'AZUL', 'VERDE', 'AMARELO',
  'LARANJA', 'ROXO', 'ROSA', 'CINZA', 'PRETO',
];

const TYPE_OPTIONS = [
  'PESSOAL', 'PROFISSIONAL', 'ESTUDOS', 'SAUDE',
  'FINANCAS', 'LAZER', 'CASA', 'VIAGEM', 'COMPRAS', 'OUTROS',
];

const validationSchema = Yup.object().shape({
  nameCategory: Yup.string().required('Nome é obrigatório'),
  descriptionCategory: Yup.string().required('Descrição é obrigatória'),
  corCategoryEnum: Yup.string().required('Cor é obrigatória'),
  tipoCategoryEnum: Yup.string().required('Tipo é obrigatório'),
});

export default function NewCategoryScreen() {
  const [colorMenuVisible, setColorMenuVisible] = useState(false);
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);

  const openColorMenu = () => setColorMenuVisible(true);
  const closeColorMenu = () => setColorMenuVisible(false);
  const openTypeMenu = () => setTypeMenuVisible(true);
  const closeTypeMenu = () => setTypeMenuVisible(false);

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
          console.log('Categoria enviada:', values);
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

            {/* Select Cor */}
            <Menu
              visible={colorMenuVisible}
              onDismiss={closeColorMenu}
              anchor={
                <TextInput
                  label="Cor"
                  mode="outlined"
                  value={values.corCategoryEnum}
                  onFocus={openColorMenu}
                  showSoftInputOnFocus={false}
                  left={<TextInput.Icon icon="palette-outline" />}
                  style={styles.input}
                />
              }
            >
              {COLOR_OPTIONS.map((option) => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setFieldValue('corCategoryEnum', option);
                    closeColorMenu();
                  }}
                  title={option}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={touched.corCategoryEnum && !!errors.corCategoryEnum}>
              {errors.corCategoryEnum}
            </HelperText>

            {/* Select Tipo */}
            <Menu
              visible={typeMenuVisible}
              onDismiss={closeTypeMenu}
              anchor={
                <TextInput
                  label="Tipo"
                  mode="outlined"
                  value={values.tipoCategoryEnum}
                  onFocus={openTypeMenu}
                  showSoftInputOnFocus={false}
                  left={<TextInput.Icon icon="tag-outline" />}
                  style={styles.input}
                />
              }
            >
              {TYPE_OPTIONS.map((option) => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setFieldValue('tipoCategoryEnum', option);
                    closeTypeMenu();
                  }}
                  title={option}
                />
              ))}
            </Menu>
            <HelperText type="error" visible={touched.tipoCategoryEnum && !!errors.tipoCategoryEnum}>
              {errors.tipoCategoryEnum}
            </HelperText>

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
  button: {
    marginTop: 16,
  },
});