import { useMemo, useEffect, useRef } from 'react';
import { useFiltersPersistence } from '../hooks/useFiltersPersistence';

function ExtraButtons({ items, buttonsToShow, onFilteredItems }) {
    const { filters, updateFilters } = useFiltersPersistence({
        sortBy: 'id',
        searchTerm: '',
        searchBy: 'title'
    });
    const { sortBy, searchTerm, searchBy } = filters;

    const filteredAndSortedItems = useMemo(() => {
        if (!items || items.length === 0) return [];

        let filtered = [...items];

        if (searchTerm) {
            filtered = filtered.filter(item => {
                if (searchBy === 'id') {
                    return item.id.toString() === searchTerm.trim();
                }
                if (searchBy === 'title') {
                    return item.title?.toLowerCase().includes(searchTerm.toLowerCase());
                }
                if (searchBy === 'completed') {
                    const term = searchTerm.toLowerCase().trim();
                    if (term === 'completed') {
                        return item.completed === true;
                    }
                    if (term === 'pending') {
                        return item.completed === false;
                    }
                    return false;
                }
                return true;
            });
        }

        return filtered.sort((a, b) => {
            if (sortBy === 'id') return a.id - b.id;
            if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
            if (sortBy === 'completed') {
                if (a.completed === b.completed) return 0;
                return a.completed ? 1 : -1;
            }
            return 0;
        });
    }, [items, sortBy, searchTerm, searchBy, buttonsToShow]);

    const prevItems = useRef();
    useEffect(() => {
        const itemsString = JSON.stringify(filteredAndSortedItems);
        if (prevItems.current !== itemsString) {
            setTimeout(() => onFilteredItems(filteredAndSortedItems), 0);
            prevItems.current = itemsString;
        }
    });

    const getSearchOptions = () => {
        const options = [{ value: 'id', label: 'Search by ID' }];
        if (items && items.length > 0) {
            if (items[0].hasOwnProperty('title')) {
                options.push({ value: 'title', label: 'Search by Title' });
            }
            if (items[0].hasOwnProperty('completed')) {
                options.push({ value: 'completed', label: 'Search by Status' });
            }
        }
        return options;
    };

    const getSortOptions = () => {
        const options = [{ value: 'id', label: 'Sort by ID' }];
        if (items && items.length > 0) {
            if (items[0].hasOwnProperty('title')) {
                options.push({ value: 'title', label: 'Sort by Title' });
            }
            if (items[0].hasOwnProperty('completed')) {
                options.push({ value: 'completed', label: 'Sort by Status' });
            }
        }
        return options;
    };

    return (
        <div className="controls">
            {(buttonsToShow.includes('search') || buttonsToShow.includes('sort')) && (
                <div className="search-section">
                    {buttonsToShow.includes('search') && (
                        <>
                            <select value={searchBy} onChange={(e) => updateFilters({ searchBy: e.target.value })}>
                                {getSearchOptions().map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder={searchBy === 'completed' ? 'Type: completed or pending' : `Enter ${searchBy} to search...`} value={searchTerm}
                                onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                                className="search-input"
                            />
                        </>
                    )}

                    {buttonsToShow.includes('sort') && (
                        <select value={sortBy} onChange={(e) => updateFilters({ sortBy: e.target.value })}>
                            {getSortOptions().map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}
        </div>
    );
}

export default ExtraButtons;
