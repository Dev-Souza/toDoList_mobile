import { createStackNavigator } from '@react-navigation/stack'

// Importações
import RegisterUserScreen from '../screens/users/register/RegisterUserScreen'
import LoginScreen from '../screens/users/login/LoginScreen'
import DrawerMainScreenRoutes from './DrawerMainScreenRoutes'

const Stack = createStackNavigator()

export default function LoginRegisterStackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='ListaScreen'
        component={LoginScreen}
        options={{
          headerShown: false
        }} />
      <Stack.Screen
        name='RegisterUserScreen'
        component={RegisterUserScreen}
        options={{
          headerTitle: "Criar Usuário"
        }} />
      <Stack.Screen
        name="Drawer"
        component={DrawerMainScreenRoutes}
        options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}