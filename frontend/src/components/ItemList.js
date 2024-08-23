import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemList.css';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', description: '' });
    const [editingItemId, setEditingItemId] = useState(null);
    const [editingItem, setEditingItem] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        axios.get('http://127.0.0.1:8000/api/items/')
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    };

    const deleteItem = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/items/${id}/`)
            .then(() => {
                fetchItems();
            })
            .catch(error => {
                console.error("There was an error deleting the item!", error);
            });
    };

    const addItem = () => {
        axios.post('http://127.0.0.1:8000/api/items/', newItem)
            .then(() => {
                setNewItem({ name: '', description: '' });
                fetchItems();
            })
            .catch(error => {
                console.error("There was an error adding the item!", error);
            });
    };

    const startEditing = (item) => {
        setEditingItemId(item.id);
        setEditingItem({ name: item.name, description: item.description });
    };

    const saveItem = (id) => {
        axios.put(`http://127.0.0.1:8000/api/items/${id}/`, editingItem)
            .then(() => {
                setEditingItemId(null);
                fetchItems();
            })
            .catch(error => {
                console.error("There was an error saving the item!", error);
            });
    };

    return (
        <div className="shopping-list-container">
            <h1 className="title">My Shopping List</h1>
            <ul className="shopping-list">
		<li className="shopping-list-item" style={{backgroundColor: 'lightblue', color: 'darkblue'}}>
                        <span className="item-name">Name</span>
                        <span className="item-name">Description</span>
                        <span className="item-name">Action</span>
                    </li>
                {items.map(item => (
                    <li key={item.id} className="shopping-list-item">
                        {editingItemId === item.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingItem.name}
                                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                    className="input-field"
                                />
                                <input
                                    type="text"
                                    value={editingItem.description}
                                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                    className="input-field"
                                />
                                <button style={{backgroundColor: 'green'}} className="delete-button" onClick={() => saveItem(item.id)}>Save</button>
                            </>
                        ) : (
                            <>
                                <span className="item-name">{item.name}</span>
                                <span className="item-description">{item.description}</span>
                                <button style={{backgroundColor: 'orange', margin: 5 }} className="delete-button" onClick={() => startEditing(item)}>Modify</button>
                                <button className="delete-button" onClick={() => deleteItem(item.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <div className="add-item-container">
                <h2 className="add-item-title">Add New Item</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="input-field"
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="input-field"
                />
                <button className="add-button" onClick={addItem}>Add Item</button>
            </div>
        </div>
    );
}

export default ItemList;
