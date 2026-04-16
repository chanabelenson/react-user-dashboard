import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../auth/context/UserContext.jsx';
import { useTodosCache } from '../cache/TodosCash.jsx';
import { useFetchApi } from '../../useFetchApi.js';
import ExtraButtons from '../../shared/components/ExstraButtons.jsx';
import TodoItem from '../components/TodoItem.jsx';
import AddItemForm from '../../shared/components/AddItemForm.jsx';
import '../../../styles/todos.css';

function Todos() {
    const { userId } = useParams();
    const { getData, putData, deleteData, postData } = useFetchApi();
    const { currentUser } = useUser();
    const { getTodos, setTodosInCache } = useTodosCache();
    const [todos, setTodosState] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (currentUser) {
            showTodos();
        }
    }, [currentUser]);

    async function showTodos() {
        if (!currentUser) return;
        const cachedTodos = getTodos(currentUser.id);
        if (cachedTodos) {
            setTodosState(cachedTodos);
            setFilteredTodos(cachedTodos);
            setLoading(false);
            return;
        } else {
            dealWithTodos();
        }
    }

    async function dealWithTodos() {
        setLoading(true);
        const data = await fetchTodos();
        if (data && data.length > 0) {
            setTodosState(data);
            setFilteredTodos(data);
            setTodosInCache(currentUser.id, data);
        }
        setLoading(false);
    }

    async function fetchTodos() {
        const result = await getData(`todos?userId=${currentUser.id}`);
        return result;
    }


    // handles API by props...
    const handleUpdateTodo = useCallback(async (updatedTodo) => {
        const result = await putData(`todos/${updatedTodo.id}`, updatedTodo);
        if (result) {
            setTodosState(prevTodos => {
                const updated = prevTodos.map(t =>
                    t.id === updatedTodo.id ? result : t
                );
                setTimeout(() => setTodosInCache(currentUser.id, updated), 0);
                return updated;
            });
        } else {
            setTodosState(prevTodos => {
                const updated = prevTodos.filter(t => t.id !== updatedTodo.id);
                setTimeout(() => setTodosInCache(currentUser.id, updated), 0);
                return updated;
            });
        }
    }, [putData, setTodosInCache, currentUser]);

    const handleDeleteTodo = useCallback(async (id) => {
        const success = await deleteData(`todos/${id}`);
        if (success) {
            setTodosState(prevTodos => {
                const updated = prevTodos.filter(t => t.id !== id);
                setTimeout(() => setTodosInCache(currentUser.id, updated), 0);
                return updated;
            });
        }
    }, [deleteData, setTodosInCache, currentUser]);

    const handleAddTodo = async (title) => {
        const newTodo = {
            userId: currentUser.id,
            title: title,
            completed: false
        };

        const createdTodo = await postData('todos', newTodo);
        if (createdTodo) {
            const updatedTodos = [...todos, createdTodo];
            setTodosState(updatedTodos);
            setTodosInCache(currentUser.id, updatedTodos);
        }
    };

    const handleFilteredTodos = useCallback((filtered) => {
        setFilteredTodos(filtered);
    }, []);




    if (loading || !currentUser) return <div>Loading todos...</div>;

    return (
        <div>
            <div className="todos-container">
                <h1 className="todos-title">My Todos ({filteredTodos.length})</h1>
                <div className="add-todo-section">
                    <button
                        className="add-todo-btn"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? "Cancel" : "Add Task"}
                    </button>
                </div>

                {showAddForm && (
                    <AddItemForm
                        itemType="Todo"
                        onAdd={handleAddTodo}
                        placeholder="Todo title..."
                    />
                )}
                <ExtraButtons
                    items={todos}
                    buttonsToShow={['statusFilter', 'search', 'sort']}
                    onFilteredItems={handleFilteredTodos}
                />
                <div className="todos-list">
                    {filteredTodos.length > 0 ? (
                        filteredTodos.map(todo => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onUpdate={handleUpdateTodo}
                                onDelete={handleDeleteTodo}
                            />
                        ))
                    ) : (
                        <div className="no-todos-message">
                            <p>No todos found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Todos;

