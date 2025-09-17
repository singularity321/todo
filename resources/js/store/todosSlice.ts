import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import type { Todo } from '@/types';
import type { RootState } from './index';

interface TodosState {
    items: Todo[];
    status: 'idle' | 'loading' | 'failed';
}

const initialState: TodosState = {
    items: [],
    status: 'idle',
};

export const syncTodos = createAsyncThunk<Todo[], void, { state: RootState }>(
    'todos/sync',
    async () => {
        const data = await api<{ data?: Todo[] }>('/api/todos');
        return data?.data ?? [];
    }
);

export const addTodo = createAsyncThunk<
    void,
    Omit<Todo, 'id'>,
    { state: RootState }
>(
    'todos/add',
    async (todo, { dispatch }) => {
        await api('/api/todos', { method: 'POST', body: todo });
        dispatch(syncTodos());
    }
);

export const updateTodo = createAsyncThunk<
    void,
    { id: number; changes: Partial<Todo> },
    { state: RootState }
>(
    'todos/update', 
    async ({ id, changes }, { dispatch }) => {
        await api(`/api/todos/${id}`, { method: 'PUT', body: changes });
        dispatch(syncTodos());
    }
);

export const deleteTodo = createAsyncThunk<
    void,
    number,
    { state: RootState }
>(
    'todos/delete',
    async (id, { dispatch }) => {
        await api(`/api/todos/${id}`, { method: 'DELETE' });
        dispatch(syncTodos());
    }
);

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(syncTodos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(syncTodos.fulfilled, (state, action) => {
                state.status = 'idle';
                state.items = action.payload;
            })
            .addCase(syncTodos.rejected, (state) => {
                state.status = 'failed';
            })
            .addCase(updateTodo.pending, (state, action) => {
                const { id, changes } = action.meta.arg;
                const todo = state.items.find((item) => item.id === id);

                if (todo) {
                    Object.assign(todo, changes);
                }
            });
    },
});

export default todosSlice.reducer;
