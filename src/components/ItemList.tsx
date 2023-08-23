import React from 'react';
import Item, { ItemProps } from './Item';

interface ItemListProps {
    items: ItemProps[];
    onAddFavorite: (item: ItemProps) => void;
    onRemove: (index: number) => void;
    onAddToCart: (item: ItemProps) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onAddFavorite, onRemove, onAddToCart }) => {
    return (
        <div className="item-list">
            <h2>Shopping List</h2>
            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        {item.category && <div><strong>Category:</strong> {item.category}</div>}
                        {item.name} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}
                        <button onClick={() => onAddFavorite(item)}>Add to Favorites</button>
                        <button onClick={() => onRemove(index)}>Remove</button>
                        <button onClick={() => onAddToCart(item)}>Add Cart</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;
