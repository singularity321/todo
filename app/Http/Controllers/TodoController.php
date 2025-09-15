<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Todo;
use App\Http\Requests\Todo\StoreTodoRequest;
use App\Http\Requests\Todo\UpdateTodoRequest;
use App\Contracts\TodoContract;
use App\Http\Resources\TodoResource;

class TodoController extends Controller
{
    public function __construct(private TodoContract $todoService){}

    public function index(Request $request)
    {
        $this->authorize('viewAny', Todo::class);

        $todos = $this->todoService->list($request->user());

        return TodoResource::collection($todos);
    }

    public function store(StoreTodoRequest $request)
    {
        $todo = $this->todoService->create($request->user(), $request->validated());

        return (new TodoResource($todo))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Todo $todo)
    {
        $this->authorize('view', $todo);

        return new TodoResource($todo);
    }

    public function update(UpdateTodoRequest $request, Todo $todo)
    {
        $todo = $this->todoService->update($todo, $request->validated());

        return new TodoResource($todo);
    }

    public function destroy(Todo $todo)
    {
        $this->authorize('delete', $todo);

        $this->todoService->delete($todo);

        return response()->noContent();
    }
}
