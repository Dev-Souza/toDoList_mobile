import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';
import PendentesScreen from '../screens/tasks/PendentesScreen';
import EmAndamentoScreen from '../screens/tasks/EmAndamentoScreen';
import ConcluidasScreen from '../screens/tasks/ConcluidasScreen';

const Tab = createBottomTabNavigator();

export default function TabsMainScreenRoutes() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Pendentes"
                component={PendentesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Andamento"
                component={EmAndamentoScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Concluidas"
                component={ConcluidasScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubble-ellipses-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}
