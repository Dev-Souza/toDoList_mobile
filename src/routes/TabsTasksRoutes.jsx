import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';

import EmAndamentoScreen from '../screens/tasks/EmAndamentoScreen';
import ConcluidasScreen from '../screens/tasks/ConcluidasScreen';
import StackPendentesToEdit from './StackPendentesToEdit';
import StackEmAndamentoToEdit from './StackEmAndamentoToEdit';
import StackConcluidasToEdit from './StackConcluidasToEdit';

const Tab = createBottomTabNavigator();

export default function TabsMainScreenRoutes() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Pendentes"
                component={StackPendentesToEdit}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="time-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Andamento"
                component={StackEmAndamentoToEdit}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="refresh-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Concluidas"
                component={StackConcluidasToEdit}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="checkbox-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}