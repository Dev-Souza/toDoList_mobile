import { createDrawerNavigator } from '@react-navigation/drawer'

import { Ionicons } from '@expo/vector-icons'
import TabsMainScreenRoutes from './TabsMainScreenRoutes'

const Drawer = createDrawerNavigator()

export default function DrawerMainScreenRoutes() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen
                name="MainScreen"
                component={TabsMainScreenRoutes}
                options={{
                    title: 'Tarefas',
                    drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                }}
            />
        </Drawer.Navigator>
    )
}