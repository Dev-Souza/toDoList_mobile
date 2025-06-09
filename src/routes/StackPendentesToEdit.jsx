import { createStackNavigator } from '@react-navigation/stack'
import PendentesScreen from '../screens/tasks/PendentesScreen'
import EditTaskScreen from '../screens/tasks/EditTaskScreen'

// Importações


const Stack = createStackNavigator()

export default function StackPendentesToEdit() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='PedentesStack'
        component={PendentesScreen}
        options={{
            headerShown: false
        }}/>
      <Stack.Screen
        name='EditPendentes'
        component={EditTaskScreen}
        options={{
          headerTitle: "Editar Tarefa"
        }} />
    </Stack.Navigator>
  )
}