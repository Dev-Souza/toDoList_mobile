import { StyleSheet, View, ScrollView, Image, Alert } from 'react-native'
import { useCallback, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import ActivityIndicatorComponent from '../../components/ActivityIndicadorComponent';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import toDoListService from '../../services/toDoListService';
import { TextInput, Button } from 'react-native-paper';
import { Formik } from 'formik';

export default function EditPerfilScreen({ navigation, route }) {
  const [idUser, setIdUser] = useState('');
  const [token, setToken] = useState('');
  const [user, setUser] = useState({});
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [imageUri, setImageUri] = useState('');
  // STATE ROLE
  const [role, setRole] = useState("USER")

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const tokenStorage = await AsyncStorage.getItem('@token');
        const idUserStorage = await AsyncStorage.getItem('@userId');
        if (tokenStorage && idUserStorage) {
          setToken(tokenStorage);
          setIdUser(idUserStorage);
          await getUserById(tokenStorage, idUserStorage);
        }
      };
      loadData();
    }, [])
  );

  const getUserById = async (tokenStorage, idUserStorage) => {
    try {
      setActivityIndicator(true);
      const userResponse = await toDoListService.get(`users/${idUserStorage}`, {
        headers: {
          Authorization: `Bearer ${tokenStorage}`,
          'Content-Type': 'application/json',
        }
      });
      userResponse.data.fotoPerfil = 'http://192.168.1.128:8080/uploads/' + userResponse.data.fotoPerfil;
      setUser(userResponse.data);
      setImageUri(userResponse.data.fotoPerfil);
    } catch (error) {
      alert("Erro ao carregar user!");
      console.log(error);
    } finally {
      setActivityIndicator(false);
    }
  };

  // Função para escolher imagem da galeria
  const pickImage = async (setFieldValue) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos para selecionar uma imagem.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setFieldValue('fotoPerfil', uri);
    }
  };

  // FUNCTION UPDATE USER
  const updateUser = async (values) => {
    try {
      setActivityIndicator(true);

      const formData = new FormData();
      formData.append('username', values.userName);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('role', role);

      // IF GO IMAGE
      if (values.fotoPerfil) {
        const uri = values.fotoPerfil;
        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('fotoPerfil', {
          uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      const responseuserUpdated = await toDoListService.post(`users/${idUser}/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Este cabeçalho é crucial
        }
      })
      alert("Perfil alterado com sucesso!");
      navigation.goBack();
    } catch (error) {
      alert("Erro ao alterar user!", error);
      console.log(error);
    } finally {
      setActivityIndicator(false)
    }
  };

  if (activityIndicator) return <ActivityIndicatorComponent />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        enableReinitialize
        initialValues={{
          userName: user.userName || '',
          email: user.email || '',
          phone: user.phone || '',
          fotoPerfil: user.fotoPerfil || '',
        }}
        onSubmit={values => updateUser(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
          <View>
            <TextInput
              label="Usuário"
              value={values.userName}
              onChangeText={handleChange('userName')}
              onBlur={handleBlur('userName')}
              style={styles.input}
            />

            <TextInput
              label="Nova Senha?"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              style={styles.input}
            />

            <TextInput
              label="Email"
              keyboardType="email-address"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              style={styles.input}
            />

            <TextInput
              label="Telefone"
              keyboardType="phone-pad"
              value={values.phone}
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              style={styles.input}
            />

            {imageUri ? (
              <Image
                source={{ uri: imageUri + '?' + new Date().getTime() }}
                style={styles.image}
              />
            ) : null}

            <Button mode="outlined" onPress={() => pickImage(setFieldValue)} style={{ marginVertical: 10 }}>
              Selecionar nova foto
            </Button>

            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
              Salvar Alterações
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginVertical: 15,
  },
});