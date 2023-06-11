import { useContext, useState } from 'react';
import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  Heading,
  useToast,
} from 'native-base';
import { ScreenHeader } from '../components/ScreenHeader';
import { UserPhoto } from '../components/UserPhoto';
import { Alert, TouchableOpacity } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Controller, useForm } from 'react-hook-form';
import { AuthContext } from '../contexts/AuthContext';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../services/api';
import { AppError } from '../utils/AppError';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { platformSpecificSpaceUnits } from 'native-base/lib/typescript/theme/tools';

const PHOTO_SIZE = 33;

interface FormDataProps {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

type FileInfoProps = FileSystem.FileInfo & {
  size: number;
  md5?: string | undefined;
  modificationTime: number;
};

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  password: yup
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .nullable()
    .transform((value) => (!!value ? value : null)),
  password_confirmation: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref('password')], 'As senhas devem ser iguais.')
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required('Informe a confirmação da senha.')
          .transform((value) => (!!value ? value : null)),
    }),
});

export function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const { user, updateUserProfile } = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
    resolver: yupResolver(profileSchema),
  });

  const { show } = useToast();

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsLoading(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put('/users', data);

      show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      });

      updateUserProfile(userUpdated);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível atualizar o perfil';

      show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUserPhotoSelect() {
    try {
      setPhotoIsLoading(true);

      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = (await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
          { size: true },
        )) as FileInfoProps;

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB',
            placement: 'top',
            bgColor: 'red.500',
          });
        }

        setUserPhoto(photoSelected.assets[0].uri);
        show({
          title: 'Foto atualizada com sucesso!',
          placement: 'top',
          bgColor: 'green.500',
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={{
                uri: `${
                  userPhoto
                    ? userPhoto
                    : 'https://avatars.githubusercontent.com/u/37388181?v=4'
                }`,
              }}
              alt="foto do usuário"
              size={PHOTO_SIZE}
            />
          )}
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                bg="gray.600"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                bg="gray.600"
                onChangeText={onChange}
                isDisabled
                value={value}
              />
            )}
          />
        </Center>
        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" mb={2}>
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
                isInvalid={!!errors.password}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirmation"
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password_confirmation?.message}
                isInvalid={!!errors.password_confirmation}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isLoading}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
