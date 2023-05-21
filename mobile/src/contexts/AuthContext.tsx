import { ReactNode, createContext } from 'react';
import { UserDTO } from '../dtos/UserDTO';

export interface AuthContextDataProps {
  user: UserDTO;
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
);

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  return (
    <AuthContext.Provider
      value={{
        user: {
          id: '1',
          name: 'Lucas',
          email: 'lucass.mark@gmail.com',
          avatar: 'lucas.png',
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
