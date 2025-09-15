<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Collection;

use App\Models\Todo;
use App\Models\User;

interface TodoContract
{
    public function list(User $user): Collection;
    public function create(User $user, array $data): Todo;
    public function update(Todo $todo, array $data): Todo;
    public function delete(Todo $todo): bool;
}