import { PaperProvider } from 'react-native-paper';
import LoginRegisterStackRoutes from './src/routes/LoginRegisterStackRoutes';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <LoginRegisterStackRoutes />
      </NavigationContainer>
    </PaperProvider>
  );
}

