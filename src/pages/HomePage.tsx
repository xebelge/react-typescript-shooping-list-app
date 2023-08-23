import React, { useState, useEffect } from 'react';
import ItemList from '../components/ItemList';
import CategoryList from '../components/CategoryList';
import FavoritesList from '../components/FavoritesList';
import Notification from '../components/Notification';
import { getItem, setItem, getCategory, setCategory } from '../utils/storage';
import { ItemProps } from 'components/Item';

const HomePage: React.FC = () => {

    const initialItems = [
        { name: 'Apple', quantity: 5, price: 1.5 },
        { name: 'Banana', quantity: 3, price: 0.5 },
    ];

    const initialCategories = getCategory('categories') || ['Fruits', 'Vegetables', 'Cleaning Products'];

    const [items, setItems] = useState<ItemProps[]>(initialItems);
    const [favoriteItems, setFavoriteItems] = useState<ItemProps[]>([]);
    const [categories, setCategories] = useState<string[]>(initialCategories);
    const [notification, setNotification] = useState<string | null>(null);
    const [newItem, setNewItem] = useState<ItemProps>({ name: '', quantity: 0, price: 0 });
    const [budget, setBudget] = useState<number>(0);
    const [cartItems, setCartItems] = useState<ItemProps[]>([]);


    useEffect(() => {
        updateAppStateFromLocalStorage();
    }, []);

    const handleAddFavorite = (item: ItemProps): void => {
        if (!favoriteItems.some(favItem => favItem.name === item.name)) {
            setFavoriteItems([...favoriteItems, item]);
            setNotification('Item added to favorites.');
        } else {
            setNotification('Item is already in favorites.');
        }
    };

    const handleAddItem = (): void => {
        if (newItem.name !== '' && newItem.quantity > 0 && newItem.price > 0) {
            setItems([...items, newItem]);
            setNotification('Item added.');
            setNewItem({ name: '', quantity: 0, price: 0 }); // Reset newItem after adding
        } else {
            setNotification('Please fill in all fields and enter valid values.');
        }
    };

    const handleRemoveFavorite = (index: number): void => {
        const updatedFavorites = favoriteItems.filter((_, i) => i !== index);
        setFavoriteItems(updatedFavorites);
        setNotification('Item removed from favorites.');
    };

    const handleRemoveItem = (index: number): void => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);

        // Remove the item from favorites if it exists there
        const updatedFavorites = favoriteItems.filter(favItem => favItem.name !== items[index].name);
        setFavoriteItems(updatedFavorites);

        setNotification('Item removed.');
    };

    const handleAddCategory = (category: string): void => {
        setCategories([...categories, category]);
    };

    const handleRemoveCategory = (index: number): void => {
        const updatedCategories = categories.filter((_, i) => i !== index);
        setCategories(updatedCategories);
    };

    const saveToLocalStorage = (): void => {
        setItem('favorites', favoriteItems);
        setCategory('categories', categories);
        setItem('cart', cartItems);
        setItem('budget', budget.toString());
        setNotification('Changes saved.');
    };

    const updateAppStateFromLocalStorage = (): void => {
        const savedFavorites = getItem('favorites');
        if (savedFavorites) setFavoriteItems(savedFavorites);

        const savedBudget = getItem('budget');
        if (savedBudget) setBudget(parseFloat(savedBudget));

        const savedCartItems = getItem('cart');
        if (savedCartItems) setCartItems(savedCartItems);
    };

    const handleAddToCart = (item: ItemProps): void => {
        setCartItems([...cartItems, item]);
        setNotification("Item added to cart.");
    }

    const handleRemoveSingleItemFromCart = (index: number): void => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].quantity -= 1;

        if (updatedCartItems[index].quantity <= 0) {
            updatedCartItems.splice(index, 1);
        }

        setCartItems(updatedCartItems);
        setNotification("Item removed from cart.");
    };

    const handleItemRemoveFromCart = (index: number): void => {
        const updatedCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCartItems);
        setNotification("Item overall removed from cart.");
    };

    const isBudgetExceeded = (): boolean => {
        const cartTotalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
        return cartTotalPrice > budget;
    }

    return (
        <div className="home-page">
            <h1>Targeted Shopping List</h1>
            <button onClick={saveToLocalStorage}>Save Changes</button>
            <Notification message={notification || ''} type={notification ? 'success' : 'error'} />
            <CategoryList
                categories={categories}
                onAddCategory={handleAddCategory}
                onRemoveCategory={handleRemoveCategory}
            />
            <FavoritesList favoriteItems={favoriteItems} onRemove={handleRemoveFavorite} />
            <ItemList
                items={items}
                onAddFavorite={handleAddFavorite}
                onRemove={handleRemoveItem}
                onAddToCart={handleAddToCart}
            />
            <div className="cart">
                <h2>Cart</h2>
                <ul>
                    {cartItems.map((item, index) => (
                        <li key={index}>
                            {item.name} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)} -
                            Total Price: ${(item.quantity * item.price).toFixed(2)}
                            <button onClick={() => handleItemRemoveFromCart(index)}>Remove All Item</button>
                            <button onClick={() => handleRemoveSingleItemFromCart(index)}>Remove One Item</button>
                        </li>
                    ))}
                </ul>
                <p>Overall Price: ${cartItems.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}</p>
                {budget > 0 && (
                    <p className={isBudgetExceeded() ? 'budget-exceeded' : 'budget-not-exceeded'}>
                        {isBudgetExceeded() ? 'Budget Exceeded!' : 'Budget Not Exceeded'}
                    </p>
                )}
            </div>
            <div className="budget">
                <h2>Set Budget</h2>
                <input
                    type="number"
                    placeholder="Budget"
                    value={budget}
                    onChange={(e) => setBudget(parseFloat(e.target.value))}
                />
            </div>
            <div className="add-item">
                <h2>Add New Item</h2>
                <input
                    type="text"
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={(e) =>
                        setNewItem({
                            ...newItem,
                            quantity: e.target.value !== '' ? parseInt(e.target.value) : 0,
                        })
                    }
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) =>
                        setNewItem({
                            ...newItem,
                            price: e.target.value !== '' ? parseFloat(e.target.value) : 0,
                        })
                    }
                />
                <button onClick={handleAddItem}>Add Item</button>
            </div>
        </div>
    );
}

export default HomePage;
