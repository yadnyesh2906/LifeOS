import { ApiResponse } from '../types/ApiResponse';
import { User } from '../types/User';
import storage from '../utils/storage';
import STORAGE_KEYS from '../constants/storage';

export const profileService = {
  async getProfile(): Promise<ApiResponse<User>> {
    const userData = await storage.getItem(STORAGE_KEYS.USER_DATA);
    let user: User;
    
    if (userData) {
      user = JSON.parse(userData);
    } else {
      user = {
        id: 1,
        fullName: 'Default User',
        email: 'abc@gmail.com',
      };
    }
    
    return {
      success: true,
      message: 'Profile fetched successfully',
      data: user,
    };
  },
};

export default profileService;
