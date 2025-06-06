import { createStackNavigator } from '@react-navigation/stack'
import ListCategoriesScreen from '../screens/categories/ListCategoriesScreen'
import NewCategoryScreen from '../screens/categories/NewCategoryScreen'

// Importações


const Stack = createStackNavigator()

export default function NewCategoryAndListStackRoutes() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name='ListCategoriesScreen'
                component={ListCategoriesScreen} />
            <Stack.Screen
                name='NewCategoryScreen'
                component={NewCategoryScreen} />
        </Stack.Navigator>
    )
}