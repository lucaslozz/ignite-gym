import { useContext, useState } from 'react';
import {
  Center,
  ScrollView,
  VStack,
  Skeleton,
  Text,
  Heading,
} from 'native-base';
import { ScreenHeader } from '../components/ScreenHeader';
import { UserPhoto } from '../components/UserPhoto';
import { TouchableOpacity } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Controller, useForm } from 'react-hook-form';
import { AuthContext } from '../contexts/AuthContext';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const PHOTO_SIZE = 33;

interface FormDataProps {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  password: yup
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .nullable()
    .transform((value) => (!!value ? value : null)),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'A confirmação de senha não confere')
    .nullable()
    .transform((value) =>
      (!!value ? value : null).when('password', {
        is: (Field: any) => Field,
        then: (schema: any) =>
          schema.nullable().required('A confirmação de senha é obrigatária'),
      }),
    ),
});

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
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

  async function handleProfileUpdate(data: FormDataProps) {
    console.log(data);
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
                uri: 'https://avatars.githubusercontent.com/u/37388181?v=4',
              }}
              alt="foto do usuário"
              size={PHOTO_SIZE}
            />
          )}
          <TouchableOpacity>
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
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
