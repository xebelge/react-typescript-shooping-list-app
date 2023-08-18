import React, { useState, useEffect } from 'react';
import ItemList from '../components/ItemList';
import CategoryList from '../components/CategoryList';
import FavoritesList from '../components/FavoritesList';
import Notification from '../components/Notification';
import { getItem, setItem } from '../utils/storage';
import { ItemProps } from 'components/Item';

const HomePage: React.FC = () => {
    const initialItems = [
        { name: 'Apple', quantity: 5, price: 1.5 },
        { name: 'Banana', quantity: 3, price: 0.5 },
    ];

    const initialCategories = ['Fruits', 'Vegetables', 'Cleaning Products'];

    const [items, setItems] = useState<ItemProps[]>(initialItems);
    const [favoriteItems, setFavoriteItems] = useState<ItemProps[]>([]);
    const [recentItems, setRecentItems] = useState<ItemProps[]>([]);
    const [notification, setNotification] = useState<string | null>(null);
    const [newItem, setNewItem] = useState<ItemProps>({ name: '', quantity: 0, price: 0 });

    useEffect(() => {
        loadFromLocalStorage();
    }, []);

    const handleAddFavorite = (item: ItemProps): void => {
        setFavoriteItems([...favoriteItems, item]);
        setNotification("Item added to favorites.");
    };

    const handleAddItem = (): void => {
        if (newItem.name !== "") {
            setItems([...items, newItem]);
            setNotification("Item added.");
            // Reset newItem after adding
            setNewItem({ name: '', quantity: 0, price: 0 });
        }
    }

    const handleAddRecent = (item: ItemProps): void => {
        setRecentItems([item, ...recentItems.slice(0, 4)]);
    };

    const handleRemoveFavorite = (index: number): void => {
        const updatedFavorites = favoriteItems.filter((_, i) => i !== index);
        setFavoriteItems(updatedFavorites);
        setNotification('Item removed from favorites.');
    };

    const handleRemoveItem = (index: number): void => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        setNotification('Item removed.');
    };

    const saveToLocalStorage = (): void => {
        setItem('favorites', favoriteItems);
        setItem('recent', recentItems);
    };

    const loadFromLocalStorage = (): void => {
        const savedFavorites = getItem('favorites');
        const savedRecent = getItem('recent');
        if (savedFavorites) setFavoriteItems(savedFavorites);
        if (savedRecent) setRecentItems(savedRecent);
    };


    return (
        <div className="home-page">
            <h1>Targeted Shopping List</h1>
            <button onClick={saveToLocalStorage}>Save Changes</button>
            <button onClick={loadFromLocalStorage}>Load Saved Data</button>
            <Notification message={notification || ''} type={notification ? 'success' : 'error'} />
            <CategoryList categories={initialCategories} />
            <FavoritesList favoriteItems={favoriteItems} onRemove={handleRemoveFavorite} />
            <ItemList items={items} onAddFavorite={handleAddFavorite} onRemove={handleRemoveItem} />
            <div>
                <h2>Add New Item</h2>
                <input type='text' placeholder='Enter item name' value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                <input type='text' placeholder='Enter item quantity' value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })} />
                <input type='text' placeholder='Enter item price' value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })} />
                <button onClick={handleAddItem}>Add Item</button>
            </div>
        </div>
    );
};

export default HomePage;