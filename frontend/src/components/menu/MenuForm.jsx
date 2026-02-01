import React, { useState } from 'react';
import MenuItemRow from './MenuItemRow';
import { addMenuBulk } from '../../services/menu.api';

const MenuForm = () => {
    const [items, setItems] = useState([{ name: '', description: '', price: '', image: null, previewUrl: '' }]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [globalError, setGlobalError] = useState('');

    const handleAddItem = () => {
        setItems([...items, { name: '', description: '', price: '', image: null, previewUrl: '' }]);
    };

    const handleRemoveItem = (index) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    const handleChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);

        // Clear error for this field if exists
        if (errors[index]?.[field]) {
            const newErrors = { ...errors };
            delete newErrors[index][field];
            setErrors(newErrors);
        }
    };

    const validate = () => {
        const newErrors = {};
        let isValid = true;
        items.forEach((item, index) => {
            if (!item.name.trim()) {
                newErrors[index] = { ...newErrors[index], name: 'Required' };
                isValid = false;
            }
            if (!item.price) {
                newErrors[index] = { ...newErrors[index], price: 'Required' };
                isValid = false;
            }
        });
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setGlobalError('');

        if (!validate()) return;

        setLoading(true);
        const formData = new FormData();

        // Append all items. Backend expects array of data or specific structure.
        // Assuming backend works with mapped indices like items[0][name], etc. 
        // OR better, we append JSON for text data and files separately.
        // Let's check plan: "Submit all items in one request".
        // Typical Multer approach: 
        // fields: name[], description[], price[]
        // files: images[]
        // But to keep association, let's look at standard practices. 
        // Often simplest is to append index to key: `items[${index}][name]`

        items.forEach((item, index) => {
            formData.append(`items[${index}][name]`, item.name);
            formData.append(`items[${index}][description]`, item.description);
            formData.append(`items[${index}][price]`, item.price);
            if (item.image) {
                formData.append(`images`, item.image); // If using array of files, ensuring order corresponds to index is tricky without careful backend handling.
                // Alternatively, backend might expect specific field name per item.
                // Let's try to append with index in name if backend supports it, or valid approach:
                // If backend handles `req.files` as array, we must ensure order.
                // Let's assume for now we construct a JSON string for metadata and send files separately.
                // Or simply:
                // formData.append('names[]', item.name)
                // formData.append('descriptions[]', item.description)
                // ...
                // And files:
                // if (item.image) formData.append('images', item.image) 
                // But sparse arrays?
                // Let's use the explicit indexed field names standard compatible with many body parsers (like "obj[0][prop]")
            }
            // For the file to be associated with index, we might need a specific naming convention or order.
            // Let's stick to appending everything with index in key for text, and handle files.
            // If I look at typical express-multer interaction, straightforward "bulk" often implies sending an array of objects.
            // Since we can't send array of objects AND files easily in one go without complex parsing on backend...
            // Let's assume the backend endpoint handles `items` as a JSON string and `images` as files?
            // Or simply separate fields. 
            // Without seeing backend code, I will use `items` as a stringified JSON and `files` as separate uploads, 
            // OR use the detailed FormData approach:
        });

        // Actually, simplest robust way for "bulk with images" is often:
        // Text data as one JSON field called 'data'
        // Files attached with specific keys or just 'files'.

        // Let's construct a cleaner payload for the text parts
        // Construct payload matching backend expectations
        // Backend expects 'foods' as JSON string and images with keys like 'image_0', 'image_1'

        const itemsData = items.map(item => ({
            name: item.name,
            description: item.description,
            price: item.price
        }));

        formData.append('foods', JSON.stringify(itemsData));

        items.forEach((item, index) => {
            if (item.image) {
                // Backend searches for `image_${i}`
                formData.append(`image_${index}`, item.image);
            }
        });

        try {
            await addMenuBulk(formData);
            setSuccessMessage('Menu items added successfully!');
            setItems([{ name: '', description: '', price: '', image: null, previewUrl: '' }]); // Reset
        } catch (err) {
            console.error(err);
            setGlobalError(err.response?.data?.message || 'Failed to populate menu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0 }}>Add Menu Items</h2>

            {globalError && <div style={{ color: 'red', marginBottom: '16px' }}>{globalError}</div>}
            {successMessage && <div style={{ color: 'green', marginBottom: '16px' }}>{successMessage}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) minmax(200px, 2fr) 100px 150px 40px', gap: '12px', fontWeight: 'bold', borderBottom: '2px solid #eee', paddingBottom: '8px', marginBottom: '8px', fontSize: '0.9rem', color: '#666' }}>
                <div>Name</div>
                <div>Description</div>
                <div>Price (₹)</div>
                <div>Image</div>
                <div></div>
            </div>

            {items.map((item, index) => (
                <MenuItemRow
                    key={index}
                    index={index}
                    item={item}
                    onChange={handleChange}
                    onRemove={handleRemoveItem}
                    error={errors[index]}
                />
            ))}

            <div style={{ marginTop: '20px', display: 'flex', gap: '16px' }}>
                <button
                    type="button"
                    onClick={handleAddItem}
                    style={{ padding: '10px 20px', background: 'white', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                >
                    + Add Row
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: '10px 24px', background: '#e23744', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Uploading...' : 'Submit All Items'}
                </button>
            </div>
        </form>
    );
};

export default MenuForm;
