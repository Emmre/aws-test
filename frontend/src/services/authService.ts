import api from '../utils/api';

export const register = async (name: string, email: string, password: string) => {
  try {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.msg) {
      throw new Error(err.response.data.msg);
    }
    throw new Error('Registration failed');
  }
};

export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};
