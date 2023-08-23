// ItemList.tsx
import React from 'react';
import Item, { ItemProps } from './Item';

interface ItemListProps {
    items: ItemProps[];
    onAddFavorite: (item: ItemProps) => void;
    onRemove: (index: number) => void;
    onAddToCart: (item: ItemProps) => void;
}

interface CategorizedItems {
    [category: string]: ItemProps[];
}

const ItemList: React.FC<ItemListProps> = ({ items, onAddFavorite, onRemove, onAddToCart }) => {
    const categorizedItems: CategorizedItems = {};

    items.forEach(item => {
        if (item.category) {
            if (!categorizedItems[item.category]) {
                categorizedItems[item.category] = [];
            }
            categorizedItems[item.category].push(item);
        } else {
            if (!categorizedItems['Uncategorized']) {
                categorizedItems['Uncategorized'] = [];
            }
            categorizedItems['Uncategorized'].push(item);
        }
    });

    return (
        <div className="item-list">
            <h2>Shopping List</h2>
            <ul className="category-list">
                {Object.keys(categorizedItems).map(category => (
                    <li key={category} className="category-item">
                        <h3>{category !== 'Uncategorized' ? category : 'Other'}</h3>
                        <ul>
                            {categorizedItems[category].map((item, index) => (
                                <li key={index}>
                                    <Item {...item} />
                                    <button onClick={() => onAddFavorite(item)}>Add to Favorites</button>
                                    <button onClick={() => onRemove(index)}>Remove</button>
                                    <button onClick={() => onAddToCart(item)}>Add Cart</button>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList;
