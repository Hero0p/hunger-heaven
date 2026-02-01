import React from 'react';

const MenuItemRow = ({ index, item, onChange, onRemove, error }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(index, name, value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onChange(index, 'image', file);
            // Create preview URL
            onChange(index, 'previewUrl', URL.createObjectURL(file));
        }
    };

    return (
        <div className="menu-item-row" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(150px, 1fr) minmax(200px, 2fr) 100px 150px 40px',
            gap: '12px',
            padding: '16px 0',
            borderBottom: '1px solid #eee',
            alignItems: 'start'
        }}>
            <div>
                <input
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    value={item.name}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                {error?.name && <span style={{ color: 'red', fontSize: '0.8rem' }}>{error.name}</span>}
            </div>

            <div>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={item.description}
                    onChange={handleChange}
                    rows="1"
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                />
            </div>

            <div>
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={item.price}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                {error?.price && <span style={{ color: 'red', fontSize: '0.8rem' }}>{error.price}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ fontSize: '0.8rem' }}
                />
                {item.previewUrl && (
                    <img src={item.previewUrl} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginTop: '4px' }} />
                )}
            </div>

            <button
                type="button"
                onClick={() => onRemove(index)}
                style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '1.2rem' }}
                aria-label="Remove item"
            >
                &times;
            </button>
        </div>
    );
};

export default MenuItemRow;
