import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
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

export default function NewCategoryScreen() {
  const [visibleColorMenu, setVisibleColorMenu] = React.useState(false);
  const [visibleTypeMenu, setVisibleTypeMenu] = React.useState(false);

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
              <Text style={styles.label}>Cor da Categoria</Text>
              <TouchableOpacity
                onPress={() => setVisibleColorMenu(true)}
                style={styles.menuInput}
              >
                <Text>{values.corCategoryEnum || 'Selecionar cor'}</Text>
              </TouchableOpacity>
              <Menu
                visible={visibleColorMenu}
                onDismiss={() => setVisibleColorMenu(false)}
                anchor={<View />}
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
              <Text style={styles.label}>Tipo da Categoria</Text>
              <TouchableOpacity
                onPress={() => setVisibleTypeMenu(true)}
                style={styles.menuInput}
              >
                <Text>{values.tipoCategoryEnum || 'Selecionar tipo'}</Text>
              </TouchableOpacity>
              <Menu
                visible={visibleTypeMenu}
                onDismiss={() => setVisibleTypeMenu(false)}
                anchor={<View />}
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

            {/* Botão de envio */}
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
  label: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 4,
  },
  menuInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    justifyContent: 'center',
  },
  button: {
    marginTop: 16,
  },
});