import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, placeholder }) => {
  const handleChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="search-bar">
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder || 'Search contacts...'}
          style={{ paddingRight: searchTerm ? '40px' : '12px' }}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#666',
              padding: '0',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Clear search"
          >
            ×
          </button>
        )}
      </div>
      {searchTerm && (
        <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
          Searching for: "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;
