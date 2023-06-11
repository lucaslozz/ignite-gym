import { TouchableOpacity } from 'react-native';

import { HStack, Heading, Text, VStack, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import defaultUserPhotoImg from '../assets/userPhotoDefault.png';

import { UserPhoto } from './UserPhoto';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';

export function HomeHeader() {
  const { user, SignOut } = useContext(AuthContext);
  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <UserPhoto
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : defaultUserPhotoImg
        }
        size={16}
        alt="foto de perfil do usuario"
        mr={4}
      />

      <VStack flex={1}>
        <Text color="gray.100" fontSize="md" fontFamily="heading">
          Olá,
        </Text>
        <Heading color="gray.100" fontSize="md" fontFamily="heading">
          {user?.name}
        </Heading>
      </VStack>

      <TouchableOpacity>
        <Icon
          as={MaterialIcons}
          name="logout"
          color="gray.200"
          size={7}
          onPress={() => SignOut()}
        />
      </TouchableOpacity>
    </HStack>
  );
}
