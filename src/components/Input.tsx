import {
  Input as NativeBaseInput,
  IInputProps,
  FormControl,
} from 'native-base';

interface InputProps extends IInputProps {
  errorMessage?: string | null;
}

export function Input({
  errorMessage = null,
  isInvalid,
  ...props
}: InputProps) {
  return (
    <FormControl isInvalid={isInvalid} mb={4}>
      <NativeBaseInput
        bg="gray.700"
        h={14}
        px={4}
        borderWidth={0}
        fontSize="md"
        color="white"
        fontFamily="body"
        placeholderTextColor="gray.300"
        _focus={{
          bg: 'gray.700',
          borderWidth: 1,
          borderColor: 'green.500',
        }}
        {...props}
      />

      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
}
