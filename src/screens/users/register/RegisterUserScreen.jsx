import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import toDoListService from '../../../services/toDoListService';
import ActivityIndicatorComponent from '../../../components/ActivityIndicadorComponent';
import { TextInputMask } from 'react-native-masked-text';

// Validação com Yup
const RegisterSchema = Yup.object().shape({
  username: Yup.string().required('Usuário obrigatório'),
  password: Yup.string().min(3, 'Mínimo 6 caracteres').required('Senha obrigatória'),
  email: Yup.string().email('Email inválido').required('Email obrigatório'),
  phone: Yup.string().required('Telefone obrigatório'),
});

export default function RegisterUserScreen({ navigation }) {
  const [imageUri, setImageUri] = useState('');
  const [activityIndicator, setActivityIndicator] = useState(false)
  // ROLE
  const [role, setRole] = useState("USER")

  const pickImage = async (setFieldValue) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Você precisa permitir acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setFieldValue('fotoPerfil', uri);
    }
  };

  //Function create user
  const createUser = async (values) => {
    try {
      setActivityIndicator(true);

      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('password', values.password);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('role', values.role);

      // IF GO IMAGE
      if (values.fotoPerfil) {
        const uri = values.fotoPerfil;
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('fotoPerfil', {
          uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      const response = await toDoListService.post('users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Este cabeçalho é crucial
        },
      });
      alert("Cadastrado com sucesso!");
      // Config navigation
      navigation.goBack()
    } catch (error) {
      console.log(error.response?.data?.message || error.message || '')
      alert("Algum erro aconteceu! " + (error.response?.data?.message || error.message || ''));

    } finally {
      setActivityIndicator(false);
    }
  };

  // Chamando o LOADING
  if (activityIndicator) {
    return <ActivityIndicatorComponent />
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Cadastro de Usuário</Text>

      <Formik
        initialValues={{
          username: '',
          password: '',
          email: '',
          phone: '',
          fotoPerfil: '',
          role: ''
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          createUser(values)
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {

          //Injetando a role
          useEffect(() => {
            setFieldValue('role', role)
          }, [role])

          return (
            (
              <>
                <TextInput
                  label="Usuário"
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  error={touched.username && !!errors.username}
                  style={styles.input}
                />
                {touched.username && errors.username && <Text style={styles.error}>{errors.username}</Text>}

                <TextInput
                  label="Senha"
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password && !!errors.password}
                  style={styles.input}
                />
                {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

                <TextInput
                  label="Email"
                  keyboardType="email-address"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email && !!errors.email}
                  style={styles.input}
                />
                {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                <TextInput
                  label="Telefone"
                  keyboardType="phone-pad"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  error={touched.phone && !!errors.phone}
                  style={styles.input}
                  render={(props) => (
                    <TextInputMask 
                      {...props}
                      type='cel-phone'
                      options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(61)'
                      }}
                    />
                  )}
                />
                {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

                {imageUri && (
                  <Image source={{ uri: imageUri }} style={styles.image} />
                )}
                <Button
                  mode="outlined"
                  onPress={() => pickImage(setFieldValue)}
                  style={styles.button}
                >
                  Selecionar Foto de Perfil
                </Button>

                {/* ROLE */}
                <TextInput
                  value={values.role}
                  onChangeText={handleChange('role')}
                  style={{ display: 'none' }}
                />

                <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                  Cadastrar
                </Button>

                <Button onPress={() => navigation.goBack()} style={styles.button} textColor="gray">
                  Voltar
                </Button>
              </>
            ))
        }}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center'
  },
  input: {
    marginBottom: 12
  },
  button: {
    marginTop: 10
  },
  title: {
    textAlign: 'center',
    marginBottom: 20
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginVertical: 10
  }
});