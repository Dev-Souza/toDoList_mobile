import { createStackNavigator } from '@react-navigation/stack'
import PerfilScreen from '../screens/users/PerfilScreen'
import EditPerfilScreen from '../screens/users/EditPerfilScreen'

// Importações


const Stack = createStackNavigator()

export default function StackPerfilToEdit() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name='ScreenPerfil'
        component={PerfilScreen}/>
      <Stack.Screen
        name='EditPerfilScreen'
        component={EditPerfilScreen} />
    </Stack.Navigator>
  )
}