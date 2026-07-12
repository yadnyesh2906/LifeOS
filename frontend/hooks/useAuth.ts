import { useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useAuthContext();
  return {
    token: context.token,
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    login: context.login,
    register: context.register,
    logout: context.logout,
  };
};

export default useAuth;
