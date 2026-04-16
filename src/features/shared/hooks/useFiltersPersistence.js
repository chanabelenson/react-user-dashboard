import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useFiltersPersistence = (initialFilters = {}) => {
    const location = useLocation();
    const pageId = location.pathname.split('/').pop();

    const [filters, setFilters] = useState(() => {
        try {
            const saved = localStorage.getItem(`filters_${pageId}`);
            return saved ? { ...initialFilters, ...JSON.parse(saved) } : initialFilters;
        } catch {
            return initialFilters;
        }
    });

    const updateFilters = (newFilters) => {
        const updated = { ...filters, ...newFilters };
        setFilters(updated);
        localStorage.setItem(`filters_${pageId}`, JSON.stringify(updated));
    };

    return { filters, updateFilters };
};