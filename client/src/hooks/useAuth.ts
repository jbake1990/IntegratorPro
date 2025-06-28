import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import api from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());
      const response = await api.post('/auth/login', { email, password });
      dispatch(loginSuccess(response.data.data));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    ...auth,
    login,
    logout: logoutUser,
  };
}; 