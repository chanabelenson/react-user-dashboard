import React from 'react';
import ItemActions from '../../shared/components/ItemActions.jsx';

function TodoItem({ todo, onUpdate, onDelete }) {
    const handleToggleStatus = () => {
        const updatedTodo = { ...todo, completed: !todo.completed };
        onUpdate(updatedTodo);
    };

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <span className="todo-id">#{todo.id}</span>
            <span className="todo-title">{todo.title}</span>

            <div className="todo-actions">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={handleToggleStatus}
                    className="todo-checkbox"
                    title="Toggle completion status"
                />

                <ItemActions
                    item={todo}
                    itemType="todos"
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />

            </div>
        </div>
    );
}

export default TodoItem;