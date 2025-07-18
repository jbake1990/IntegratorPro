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
      dispatch(loginSuccess(response.data.data));
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || 'Login failed';
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