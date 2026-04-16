import { useState } from 'react';
import { useFetchApi } from '../../useFetchApi.js';
import '../../../styles/search.css';

function Search({ items, onFilteredItems }) {
  const { getData } = useFetchApi();
  const [searchBy, setSearchBy] = useState('id'); 
  const [searchTerm, setSearchTerm] = useState('');

  const searchOptions = [
    { value: 'id', label: 'ID' },
    { value: 'title', label: 'Title' }
  ];

  const handleSearch = async () => {
    if (!searchTerm) {
      onFilteredItems(items);
      return;
    }

    if (searchBy === 'id') {
      const data = await getData(`posts/${searchTerm}`);
      onFilteredItems(data ? [data] : []);
    } else {
      const filtered = items.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      onFilteredItems(filtered);
    }
  };

  return (
    <div className="search-component" style={{ marginBottom: '10px' }}>
      <select
        value={searchBy}
        onChange={(e) => setSearchBy(e.target.value)}
        style={{ marginRight: '8px', padding: '6px' }}
      >
        {searchOptions.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder={`Search by ${searchBy}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '6px', marginRight: '8px' }}
      />

      <button
        onClick={handleSearch}
        style={{
          padding: '6px 12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '3px'
        }}
      >
        Search
      </button>
    </div>
  );
}

export default Search;
