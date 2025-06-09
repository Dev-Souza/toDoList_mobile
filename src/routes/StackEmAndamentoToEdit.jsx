import { createStackNavigator } from '@react-navigation/stack'
import EmAndamentoScreen from '../screens/tasks/EmAndamentoScreen'
import EditTaskScreen from '../screens/tasks/EditTaskScreen'

// Importações


const Stack = createStackNavigator()

export default function StackEmAndamentoToEdit() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name='EmAndamentoStack'
        component={EmAndamentoScreen}/>
      <Stack.Screen
        name='EditEmAndamento'
        component={EditTaskScreen}
        options={{
          headerTitle: "Editar Tarefa"
        }} />
    </Stack.Navigator>
  )
}