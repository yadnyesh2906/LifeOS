import { ApiResponse } from '../types/ApiResponse';
import { LoginResponseData } from '../types/Auth';
import { User } from '../types/User';
import storage from '../utils/storage';

const USERS_KEY = 'lifeos_users';

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<LoginResponseData>> {
    const usersJson = await storage.getItem(USERS_KEY);
    const users: any[] = usersJson ? JSON.parse(usersJson) : [];
    
    // Default demo user fallback
    if (email.toLowerCase() === 'abc@gmail.com' && password === '123456') {
      const demoUser: User = {
        id: 1,
        fullName: 'Default User',
        email: 'abc@gmail.com',
      };
      return {
        success: true,
        message: 'Login Successful',
        data: {
          token: 'mock-jwt-token-for-demo-user',
          user: demoUser,
        },
      };
    }

    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (foundUser) {
      const userDTO: User = {
        id: foundUser.id,
        fullName: foundUser.fullName,
        email: foundUser.email,
      };
      return {
        success: true,
        message: 'Login Successful',
        data: {
          token: `mock-jwt-token-${foundUser.id}`,
          user: userDTO,
        },
      };
    }

    return {
      success: false,
      message: 'Invalid Email or Password',
      data: null as any,
    };
  },

  async register(fullName: string, email: string, password: string): Promise<ApiResponse<User>> {
    const usersJson = await storage.getItem(USERS_KEY);
    const users: any[] = usersJson ? JSON.parse(usersJson) : [];

    if (email.toLowerCase() === 'abc@gmail.com' || users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return {
        success: false,
        message: 'Email already exists.',
        data: null as any,
      };
    }

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 2;
    const newUser = {
      id: newId,
      fullName,
      email,
      password,
    };

    users.push(newUser);
    await storage.setItem(USERS_KEY, JSON.stringify(users));

    const userDTO: User = {
      id: newId,
      fullName,
      email,
    };

    return {
      success: true,
      message: 'User Registered Successfully',
      data: userDTO,
    };
  },
};

export default authService;
