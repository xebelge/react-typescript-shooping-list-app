import React, { useState, useEffect } from 'react';
import ItemList from '../components/ItemList';
import CategoryList from '../components/CategoryList';
import FavoritesList from '../components/FavoritesList';
import Notification from '../components/Notification';
import { getItem, setItem, getCategory, setCategory } from '../utils/storage';
import { ItemProps } from 'components/Item';

const HomePage: React.FC = () => {
    const initialItems: ItemProps[] = [
        { name: 'Apple', quantity: 5, price: 1.5 },
        { name: 'Banana', quantity: 3, price: 0.5 },
    ];

    const initialCategories: string[] = getCategory('categories') || ['Fruits', 'Vegetables', 'Cleaning Products'];

    const [items, setItems] = useState<ItemProps[]>(initialItems);
    const [favoriteItems, setFavoriteItems] = useState<ItemProps[]>([]);
    const [categories, setCategories] = useState<string[]>(initialCategories);
    const [notification, setNotification] = useState<string | null>(null);
    const [newItem, setNewItem] = useState<ItemProps>({ name: '', quantity: 0, price: 0 });
    const [budget, setBudget] = useState<number>(0);
    const [cartItems, setCartItems] = useState<ItemProps[]>([]);
    const [isChangesMade, setIsChangesMade] = useState<boolean>(false);

    useEffect(() => {
        loadAppStateFromLocalStorage();
    }, []);

    const handleAddFavorite = (item: ItemProps): void => {
        if (!favoriteItems.some(favItem => favItem.name === item.name)) {
            setFavoriteItems([...favoriteItems, item]);
            notify('Item added to favorites.');
            setIsChangesMade(true);
        } else {
            notify('Item is already in favorites.');
        }
    };

    const handleAddItem = (): void => {
        if (isValidItem(newItem)) {
            addItem(newItem);
            notify('Item added.');
            setIsChangesMade(true);
            resetNewItem();
        } else {
            notify('Please fill in all fields and enter valid values.');
        }
    };

    const handleRemoveFavorite = (index: number): void => {
        const updatedFavorites = favoriteItems.filter((_, i) => i !== index);
        setFavoriteItems(updatedFavorites);
        notify('Item removed from favorites.');
        setIsChangesMade(true);
    };

    const handleRemoveItem = (index: number): void => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);

        const updatedFavorites = favoriteItems.filter(favItem => favItem.name !== items[index].name);
        setFavoriteItems(updatedFavorites);

        notify('Item removed.');
        setIsChangesMade(true);
    };

    const handleAddCategory = (category: string): void => {
        setCategories([...categories, category]);
        setIsChangesMade(true);
    };

    const handleRemoveCategory = (index: number): void => {
        const updatedCategories = categories.filter((_, i) => i !== index);
        setCategories(updatedCategories);
        setIsChangesMade(true);
    };

    const saveChanges = (): void => {
        if (isChangesMade) {
            persistChanges();
            setIsChangesMade(false);
        } else {
            notify('No changes made.');
        }
    };

    const loadAppStateFromLocalStorage = (): void => {
        loadFavorites();
        loadBudget();
        loadCartItems();
    };

    const handleAddToCart = (item: ItemProps): void => {
        setCartItems([...cartItems, item]);
        notify("Item added to cart.");
        setIsChangesMade(true);
    }

    const handleRemoveSingleItemFromCart = (index: number): void => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].quantity -= 1;

        if (updatedCartItems[index].quantity <= 0) {
            updatedCartItems.splice(index, 1);
        }

        setCartItems(updatedCartItems);
        notify("Item removed from cart.");
        setIsChangesMade(true);
    };

    const handleRemoveAllItemsFromCart = (index: number): void => {
        const updatedCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCartItems);
        notify("Item overall removed from cart.");
        setIsChangesMade(true);
    };

    const isBudgetExceeded = (): boolean => {
        const cartTotalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
        return cartTotalPrice > budget;
    }

    const isValidItem = (item: ItemProps): boolean => {
        return item.name !== '' && item.quantity > 0 && item.price > 0;
    };

    const addItem = (item: ItemProps): void => {
        setItems([...items, item]);
    };

    const resetNewItem = (): void => {
        setNewItem({ name: '', quantity: 0, price: 0 });
    };

    const persistChanges = (): void => {
        persistFavorites();
        persistCategories();
        persistCart();
        persistBudget();
        notify('Changes saved.');
    };

    const persistFavorites = (): void => {
        setItem('favorites', favoriteItems);
    };

    const persistCategories = (): void => {
        setCategory('categories', categories);
    };

    const persistCart = (): void => {
        setItem('cart', cartItems);
    };

    const persistBudget = (): void => {
        setItem('budget', budget.toString());
    };

    const loadFavorites = (): void => {
        const savedFavorites = getItem('favorites');
        if (savedFavorites) setFavoriteItems(savedFavorites);
    };

    const loadBudget = (): void => {
        const savedBudget = getItem('budget');
        if (savedBudget) setBudget(parseFloat(savedBudget));
    };

    const loadCartItems = (): void => {
        const savedCartItems = getItem('cart');
        if (savedCartItems) setCartItems(savedCartItems);
    };

    const notify = (message: string): void => {
        setNotification(message);
    };

    return (
        <div className="home-page">
            <h1>Targeted Shopping List</h1>
            <button onClick={saveChanges}>Save Changes</button>
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
                            <button onClick={() => handleRemoveAllItemsFromCart(index)}>Remove All Item</button>
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
