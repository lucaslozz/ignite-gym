import { Box, useTheme } from 'native-base';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';

export function Routes() {
  const { colors } = useTheme();
  const { user } = useContext(AuthContext);

  console.log(user);

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  return (
    <Box bg="gray.700" flex={1}>
      <NavigationContainer>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  );
}
