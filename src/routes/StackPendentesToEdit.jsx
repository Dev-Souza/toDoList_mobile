import { createStackNavigator } from '@react-navigation/stack'
import PendentesScreen from '../screens/tasks/PendentesScreen'
import EditTaskScreen from '../screens/tasks/EditTaskScreen'

// Importações


const Stack = createStackNavigator()

export default function StackPendentesToEdit() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name='PedentesStack'
        component={PendentesScreen}/>
      <Stack.Screen
        name='EditPendentes'
        component={EditTaskScreen} />
    </Stack.Navigator>
  )
}