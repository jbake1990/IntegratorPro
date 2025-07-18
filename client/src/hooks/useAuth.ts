import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import api from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (username: string, password: string) => {
    try {
      console.log('Attempting login with username:', username);
      dispatch(loginStart());
      const response = await api.post('/auth/login', { username, password });
      console.log('Login response:', response.data);
      
      // Validate response structure
      if (!response.data || !response.data.data) {
        throw new Error('Invalid response structure');
      }
      
      const { user, token } = response.data.data;
      
      // Validate user object
      if (!user || !token) {
        throw new Error('Missing user or token in response');
      }
      
      // Ensure user object has required fields
      const validatedUser = {
        id: user.id || '',
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        role: user.role || 'EMPLOYEE',
        isActive: user.isActive !== undefined ? user.isActive : true,
      };
      
      dispatch(loginSuccess({ user: validatedUser, token }));
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  };

  const logoutUser = () => {
    console.log('Logging out user');
    dispatch(logout());
  };

  return {
    ...auth,
    login,
    logout: logoutUser,
  };
}; 