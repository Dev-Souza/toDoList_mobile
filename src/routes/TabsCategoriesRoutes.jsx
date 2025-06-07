import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';


import NewCategoryScreen from '../screens/categories/NewCategoryScreen';
import StackCategoriesToEdit from './StackCategoriesToEdit';

const Tab = createBottomTabNavigator();

export default function TabsCategoriesRoutes() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="ListCategorias"
                component={StackCategoriesToEdit}
                options={{
                    title: "Lista Categorias",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="NewCategoryScreen"
                component={NewCategoryScreen}
                options={{
                    title: "Nova Categoria",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}