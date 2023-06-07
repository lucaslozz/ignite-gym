import { Box, useTheme } from 'native-base';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import { Loading } from '../components/Loading';

export function Routes() {
  const { colors } = useTheme();
  const { user, isLoadingUserStorageData } = useContext(AuthContext);

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  return (
    <Box bg="gray.700" flex={1}>
      <NavigationContainer>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
