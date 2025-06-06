import { createDrawerNavigator } from '@react-navigation/drawer'
import { Ionicons } from '@expo/vector-icons'

import TabsMainScreenRoutes from './TabsTasksRoutes'
import NewTaskScreen from '../screens/tasks/drawer/NewTaskScreen'
import PerfilScreen from '../screens/users/PerfilScreen'
import SairRoutes from './SairRoutes'
import NewCategoryScreen from '../screens/categories/NewCategoryScreen'
import TabsCategoriesRoutes from './TabsCategoriesRoutes'

const Drawer = createDrawerNavigator()

export default function DrawerMainScreenRoutes() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen
                name="MainScreen"
                component={TabsMainScreenRoutes}
                options={{
                    title: 'Tarefas',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="checkmark-done-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name='NewTaskScreen'
                component={NewTaskScreen}
                options={{
                    title: 'Nova Tarefa',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="add-circle-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name='Categories'
                component={TabsCategoriesRoutes}
                options={{
                    title: 'Categorias',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="layers-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name='PerfilScreen'
                component={PerfilScreen}
                options={{
                    title: 'Perfil',
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="person-circle-outline" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name='Sair'
                component={SairRoutes}
                options={{
                    title: 'Sair',
                    headerShown: false,
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="log-out-outline" size={size} color={color} />
                    ),
                }}
            />
        </Drawer.Navigator>
    )
}