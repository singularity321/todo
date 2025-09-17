import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks/use-app-dispatch';
import { useAppSelector } from '@/hooks/use-app-selector';
import AppLayout from '@/layouts/app-layout';
import { todos as todosRoute } from '@/routes';
import type { RootState } from '@/store';
import { addTodo, deleteTodo, syncTodos, updateTodo } from '@/store/todosSlice';
import { type BreadcrumbItem, type Todo } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Todos',
        href: todosRoute().url,
    },
];

export default function Todos() {
    const dispatch = useAppDispatch();
    const { items, status } = useAppSelector((state: RootState) => state.todos);

    const [text, setText] = useState('');
    const [due, setDue] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [editDue, setEditDue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text || !due) return;
        dispatch(addTodo({ text, due, done: false }));
        setText('');
        setDue('');
    };

    const startEditing = (todo: Todo) => {
        setEditingId(todo.id);
        setEditText(todo.text);
        setEditDue(todo.due);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditText('');
        setEditDue('');
    };

    const handleUpdate = (id: number) => {
        if (!editText || !editDue) return;
        dispatch(updateTodo({ id, changes: { text: editText, due: editDue } }));
        cancelEditing();
    };

    useEffect(() => {
        dispatch(syncTodos());
    }, [dispatch]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Todos" />
            <div className="p-4">
                <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
                    <Input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="New todo" className="flex-1" />
                    <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="w-38" />
                    <Button type="submit">Add</Button>
                </form>
                {status === 'loading' && <div>Loading...</div>}
                <ul className="space-y-2">
                    {items.map((todo: Todo) => (
                        <li key={todo.id} className="flex items-center justify-between rounded-md border p-2">
                            <div className="flex flex-1 items-center gap-2">
                                <Checkbox
                                    checked={todo.done}
                                    onCheckedChange={(checked) =>
                                        dispatch(
                                            updateTodo({
                                                id: todo.id,
                                                changes: { done: checked === true },
                                            }),
                                        )
                                    }
                                />
                                {editingId === todo.id ? (
                                    <>
                                        <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-1" />
                                        <Input type="date" value={editDue} onChange={(e) => setEditDue(e.target.value)} className="w-38" />
                                    </>
                                ) : (
                                    <div className="flex flex-col">
                                        <span className={todo.done ? 'line-through' : ''}>{todo.text}</span>
                                        <span className="text-sm text-muted-foreground">{todo.due}</span>
                                    </div>
                                )}
                            </div>
                            <div className="ml-2 flex gap-2">
                                {editingId === todo.id ? (
                                    <>
                                        <Button size="sm" onClick={() => handleUpdate(todo.id)}>
                                            Save
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={cancelEditing}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button size="sm" variant="outline" onClick={() => startEditing(todo)}>
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => dispatch(deleteTodo(todo.id))}>
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </AppLayout>
    );
}
