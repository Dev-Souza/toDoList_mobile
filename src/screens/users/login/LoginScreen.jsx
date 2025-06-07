import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { TextInput, Button, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import ActivityIndicatorComponent from '../../../components/ActivityIndicadorComponent';
import toDoListService from '../../../services/toDoListService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Esquema de validação com Yup
const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Usuário obrigatório'),
  password: Yup.string().min(3, 'Mínimo 6 caracteres').required('Campo obrigatório'),
});

export default function LoginScreen({ navigation, route }) {
  // LOADING 
  const [activityIndicator, setActivityIndicator] = useState(false)

  // Funcion the login
  const login = async (values) => {
    try {
      setActivityIndicator(true);
      const response = await toDoListService.post("users/login", values)
      setActivityIndicator(false)
      // Save token
      await AsyncStorage.setItem('@token', response.data.token);
      // Save ID the user
      await AsyncStorage.setItem('@userId', String(response.data.userId));

      // Caso dê certo vai para minha tela inicial
      navigation.navigate('Drawer');
    } catch (error) {
      alert("Usuário ou senha incorretos!")
    } finally {
      setActivityIndicator(false)
    }
  }

  // Chamando o LOADING
  if (activityIndicator) {
    return <ActivityIndicatorComponent />
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ToDoList</Text>

      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={values => {
          login(values)
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              label="Usuário"
              mode="outlined"
              style={styles.input}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              autoCapitalize="none"
              error={touched.username && !!errors.username}
            />
            {touched.username && errors.username && (
              <Text style={styles.error}>{errors.username}</Text>
            )}

            <TextInput
              label="Senha"
              mode="outlined"
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
              error={touched.password && !!errors.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              Entrar
            </Button>
          </>
        )}
      </Formik>

      <TouchableOpacity onPress={() => navigation.navigate('RegisterUserScreen')}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#6200ee',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#6200ee',
    fontWeight: '500',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
});