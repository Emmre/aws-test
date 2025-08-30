export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Todo {
  id: string;
  user: string;
  text: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

