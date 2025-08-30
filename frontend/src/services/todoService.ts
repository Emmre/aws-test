import api from '../utils/api';
import { Todo } from '../types';

export const getTodos = async (token: string) => {
  const res = await api.get<Todo[]>('/todos', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addTodo = async (formData: FormData, token: string) => {
  const res = await api.post<Todo>('/todos', formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateTodo = async (id: string, formData: FormData, token: string) => {
  const res = await api.put<Todo>(`/todos/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteTodo = async (id: string, token: string) => {
  const res = await api.delete(`/todos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
