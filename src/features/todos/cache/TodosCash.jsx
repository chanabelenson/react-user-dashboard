import React, { createContext, useState, useContext, useEffect } from 'react';

const TodosCacheContext = createContext();

export const TodosCacheProvider = ({ children }) => {
    const [todosCache, setTodosCache] = useState({});

    useEffect(() => {
        const savedCache = localStorage.getItem('todosCache');
        if (savedCache) {
            setTodosCache(JSON.parse(savedCache));
        }
    }, []);

    const getTodos = (userId) => {
        return todosCache[userId] || null;
    };

    const setTodosInCache = (userId, todos) => {
        const newCache = {
            ...todosCache,
            [userId]: todos
        };
        setTodosCache(newCache);
        localStorage.setItem('todosCache', JSON.stringify(newCache));
    };

    const clearCache = () => {
        setTodosCache({});
        localStorage.removeItem('todosCache');
    };

    return (
        <TodosCacheContext.Provider value={{ getTodos, setTodosInCache, clearCache }}>
            {children}
        </TodosCacheContext.Provider>
    );
};

export const useTodosCache = () => {
    return useContext(TodosCacheContext);
};