import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SairRoutes({navigation}) {

    useEffect(() => {
        const logout = async () => {
            await AsyncStorage.removeItem('@token'); // Apaga o token
            await AsyncStorage.removeItem('@userId'); // Apaga ID user
            navigation.reset({
                index: 0,
                routes: [{ name: 'ListaScreen' }], // volta pra tela de login
            });
        };

        logout();
    }, []);

    return (
        <View>
            <ActivityIndicator />
        </View>
    );
}
