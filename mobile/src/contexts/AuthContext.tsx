import { ReactNode, createContext, useState } from 'react';

import { api } from '../services/api';
import { UserDTO } from '../dtos/UserDTO';

export interface AuthContextDataProps {
  user: UserDTO;
  SignIn: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
);

interface AuthContextProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);

  async function SignIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password });
      if (data.user) {
        console.log(data.user);
        setUser(data.user);
      }
    } catch (error) {
      throw error;
    }
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        SignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
