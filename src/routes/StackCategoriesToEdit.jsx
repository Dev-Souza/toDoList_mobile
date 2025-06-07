import { createStackNavigator } from '@react-navigation/stack'
import ListCategoriesScreen from '../screens/categories/ListCategoriesScreen'
import EditCategoryScreen from '../screens/categories/EditCategoryScreen'

// Importações


const Stack = createStackNavigator()

export default function StackCategoriesToEdit() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='ListaScreen'
        component={ListCategoriesScreen}
        options={{
          headerShown: false
        }} />
      <Stack.Screen
        name='EditCategoryScreen'
        component={EditCategoryScreen}
        options={{
          headerTitle: "Editar Categoria"
        }} />
    </Stack.Navigator>
  )
}