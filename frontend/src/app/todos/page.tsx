"use client";
import React, {useEffect, useState, useRef} from 'react';
import {getTodos, addTodo, updateTodo, deleteTodo} from '../../services/todoService';
import {Todo} from '../../types';
import {useAuth} from '../auth/AuthContext';
import {useRouter} from 'next/navigation';
import { toast } from 'react-toastify';

function EditTodoModal({todo, open, onClose, onSave, loading}: {
    todo: Todo | null;
    open: boolean;
    onClose: () => void;
    onSave: (text: string, file: File | null) => void;
    loading: boolean;
}) {
    const [text, setText] = useState(todo?.text || '');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setText(todo?.text || '');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, [todo]);

    if (!open || !todo) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
                    onClick={onClose}
                    aria-label="Kapat"
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-4" style={{color: 'var(--primary)'}}>Görevi Düzenle</h2>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={e => {
                        e.preventDefault();
                        onSave(text, file);
                    }}
                >
                    <input
                        type="text"
                        className="input input-bordered"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        autoFocus
                    />
                    <input
                        type="file"
                        className="file-input"
                        ref={fileInputRef}
                        onChange={e => setFile(e.target.files?.[0] || null)}
                        accept="image/*"
                    />
                    {todo.image && !file && (
                        <img src={todo.image} alt="todo"
                             className="w-24 h-24 object-cover rounded border mx-auto"/>
                    )}
                    {file && (
                        <img src={URL.createObjectURL(file)} alt="preview"
                             className="w-24 h-24 object-cover rounded border mx-auto"/>
                    )}
                    <div className="flex gap-2 justify-end mt-2">
                        <button type="button" className="btn btn-secondary" onClick={onClose}
                                disabled={loading}>Vazgeç
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading || !text.trim()}>
                            {loading ? <span className="loading loading-spinner loading-xs mr-2"></span> : null}
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function TodosPage() {
    const {token, hydrated} = useAuth();
    const router = useRouter();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editTodo, setEditTodo] = useState<Todo | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!hydrated) return; // Wait until auth context is hydrated
        if (!token) {
            router.push('/auth/login');
            return;
        }
        fetchTodos();
        // eslint-disable-next-line
    }, [token, hydrated]);

    const fetchTodos = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getTodos(token!);
            setTodos(data);
        } catch (err: any) {
            setError('Failed to fetch todos');
            toast.error('Failed to fetch todos', { theme: 'colored' });
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text) return;
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('text', text);
            if (file) formData.append('image', file);
            await addTodo(formData, token!);
            setText('');
            setFile(null);
            toast.success('Todo added successfully!', { theme: 'colored' });
            fetchTodos();
        } catch (err: any) {
            setError('Failed to add todo');
            toast.error('Failed to add todo', { theme: 'colored' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (todo: Todo) => {
        setEditTodo({...todo}); // clone to avoid stale closure issues
    };

    const handleUpdate = async (text: string, file: File | null) => {
        // Defensive: log editTodo for debugging
        if (!editTodo || !editTodo.id) {
            setError('Güncellenecek görev bulunamadı. Lütfen tekrar deneyin.');
            setEditTodo(null);
            toast.error('No todo found to update.', { theme: 'colored' });
            return;
        }
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('text', text);
            if (file) formData.append('image', file);
            await updateTodo(editTodo.id, formData, token!);
            setEditTodo(null);
            toast.success('Todo updated successfully!', { theme: 'colored' });
            fetchTodos();
        } catch (err: any) {
            setError('Failed to update todo');
            toast.error('Failed to update todo', { theme: 'colored' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        setError('');
        try {
            await deleteTodo(id, token!);
            toast.success('Todo deleted successfully!', { theme: 'colored' });
            fetchTodos();
        } catch (err: any) {
            setError('Failed to delete todo');
            toast.error('Failed to delete todo', { theme: 'colored' });
        } finally {
            setLoading(false);
        }
    };

    if (!hydrated) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-8" style={{background: 'var(--background)', minHeight: '100vh'}}>
            <h1 className="text-3xl font-bold mb-6" style={{color: 'var(--primary)'}}>My Todos</h1>
            <div className="mb-4">
                <form
                    className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded shadow"
                    onSubmit={handleAdd}>
                    <div className="flex-1 w-full">
                        <label htmlFor="todo-text" className="block text-sm font-medium mb-1"
                               style={{color: 'var(--primary-dark)'}}>Yeni Görev</label>
                        <input
                            id="todo-text"
                            type="text"
                            placeholder="Add new todo..."
                            className="input input-bordered w-full"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            disabled={loading}
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <label htmlFor="todo-image" className="block text-sm font-medium"
                               style={{color: 'var(--primary-dark)'}}>Resim (isteğe bağlı)</label>
                        <input
                            id="todo-image"
                            type="file"
                            className="file-input file-input-bordered"
                            ref={fileInputRef}
                            onChange={e => setFile(e.target.files?.[0] || null)}
                            accept="image/*"
                            disabled={loading}
                        />
                        {file && (
                            <div className="mt-1 text-xs text-gray-500 flex flex-col items-center">
                                <span>{file.name}</span>
                                <img src={URL.createObjectURL(file)} alt="preview"
                                     className="mt-1 w-16 h-16 object-cover rounded border"/>
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary min-w-[100px] mt-4 sm:mt-0"
                        disabled={loading || !text.trim()}
                        aria-busy={loading}
                    >
                        {loading ? <span className="loading loading-spinner loading-xs mr-2"></span> : null}
                        Ekle
                    </button>
                </form>
            </div>
            {loading && <div className="mb-4">Loading...</div>}
            <ul className="space-y-4">
                {todos.map((todo, idx) => (
                    <li
                        key={todo.id || `todo-fallback-${idx}`}
                        className="transition-all duration-200 bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 flex items-center justify-between gap-4 relative group border border-gray-200 dark:border-gray-700"
                        style={{color: 'var(--foreground)'}}
                    >
                        <div className="flex-1 flex items-center gap-4">
                            <span
                                className="text-lg font-medium group-hover:text-primary transition-colors duration-150">{todo.text}</span>
                            {todo.image && (
                                <img
                                    src={todo.image}
                                    alt="todo"
                                    className="w-16 h-16 object-cover rounded-lg border border-primary/30 shadow-sm"
                                />
                            )}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <button className="btn btn-sm btn-secondary flex items-center gap-1"
                                    onClick={() => handleEdit(todo)}>
                                <span className="material-icons align-middle">edit</span> Edit
                            </button>
                            <button className="btn btn-sm btn-error flex items-center gap-1"
                                    onClick={() => handleDelete(todo.id)}>
                                <span className="material-icons align-middle">delete</span> Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <EditTodoModal
                todo={editTodo}
                open={!!editTodo}
                onClose={() => setEditTodo(null)}
                onSave={handleUpdate}
                loading={loading}
            />
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        </div>
    );
}
