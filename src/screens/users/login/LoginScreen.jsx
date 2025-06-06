import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { TextInput, Button, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Esquema de validação com Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Campo obrigatório'),
  senha: Yup.string().min(3, 'Mínimo 6 caracteres').required('Campo obrigatório'),
});

export default function LoginScreen({navigation, route}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>ToDoList</Text>

            <Formik
                initialValues={{ email: '', senha: '' }}
                validationSchema={LoginSchema}
                onSubmit={values => {
                    console.log(values); // Aqui vai o login real
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <TextInput
                            label="Email"
                            mode="outlined"
                            style={styles.input}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={touched.email && !!errors.email}
                        />
                        {touched.email && errors.email && (
                            <Text style={styles.error}>{errors.email}</Text>
                        )}

                        <TextInput
                            label="Senha"
                            mode="outlined"
                            style={styles.input}
                            onChangeText={handleChange('senha')}
                            onBlur={handleBlur('senha')}
                            value={values.senha}
                            secureTextEntry
                            error={touched.senha && !!errors.senha}
                        />
                        {touched.senha && errors.senha && (
                            <Text style={styles.error}>{errors.senha}</Text>
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