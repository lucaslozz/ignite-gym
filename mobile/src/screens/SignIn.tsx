import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
} from 'native-base';
import { useForm, Controller } from 'react-hook-form';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigatorRoutesProps } from '../routes/auth.routes';

import BackgroundImg from '../assets/background.png';
import LogoSvg from '../assets/logo.svg';

import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { AppError } from '../utils/AppError';

interface SignInFormData {
  email: string;
  password: string;
}

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { navigate } = useNavigation<AuthNavigatorRoutesProps>();
  const { SignIn } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInFormData>();

  const { show } = useToast();

  function handleNewAccount() {
    navigate('signUp');
  }

  async function handleSignIn({ email, password }: SignInFormData) {
    try {
      setIsLoading(true);

      await SignIn(email, password);
      reset();
    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde.';

      show({ title, placement: 'top', bgColor: 'red.500' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily={'heading'}>
            Acesse sua conta
          </Heading>
          <Controller
            name="email"
            rules={{ required: 'Informe o e-mail' }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
                isInvalid={!!errors.password}
              />
            )}
          />

          <Button
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </Center>

        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Ainda não tem acesso?
          </Text>

          <Button
            title="Criar Conta"
            variant="outline"
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
