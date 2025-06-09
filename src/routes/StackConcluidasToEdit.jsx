import { createStackNavigator } from '@react-navigation/stack'
import ConcluidasScreen from '../screens/tasks/ConcluidasScreen'
import EditTaskScreen from '../screens/tasks/EditTaskScreen'

// Importações


const Stack = createStackNavigator()

export default function StackConcluidasToEdit() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name='ConcluidasStack'
        component={ConcluidasScreen}/>
      <Stack.Screen
        name='EditConcluidas'
        component={EditTaskScreen}
        options={{
          headerTitle: "Editar Tarefas"
        }} />
    </Stack.Navigator>
  )
}