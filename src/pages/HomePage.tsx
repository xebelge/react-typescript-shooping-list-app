import React, { useState, useEffect } from 'react';
import ItemList from '../components/ItemList';
import CategoryList from '../components/CategoryList';
import FavoritesList from '../components/FavoritesList';
import RecentItemsList from '../components/RecentItemsList';
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

    useEffect(() => {
        loadFromLocalStorage();
    }, []);

    const handleAddFavorite = (item: ItemProps): void => {
        setFavoriteItems([...favoriteItems, item]);
        setNotification("Item added to favorites.");
    };

    const handleAddRecent = (item: ItemProps): void => {
        setRecentItems([item, ...recentItems.slice(0, 4)]);
    };

    const handleAddItem = (item: ItemProps): void => {
        setItems([...items, item]);
        handleAddRecent(item);
        setNotification("Item added.");
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
            <RecentItemsList recentItems={recentItems} />
            <ItemList items={items} onAddFavorite={handleAddFavorite} onRemove={handleRemoveItem} />
        </div>
    );
};

export default HomePage;