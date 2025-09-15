<?php

namespace App\Services;

use App\Contracts\TodoContract;
use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class TodoService implements TodoContract
{
    public function list(User $user): Collection
    {
        return $user->todos()->orderBy('due', 'asc')->get();
    }

    public function create(User $user, array $data): Todo
    {
        return $user->todos()->create($data);
    }

    public function update(Todo $todo, array $data): Todo
    {
        $todo->fill($data);
        $todo->save();

        return $todo->refresh();
    }

    public function delete(Todo $todo): bool
    {
        return (bool) $todo->delete();
    }
}
