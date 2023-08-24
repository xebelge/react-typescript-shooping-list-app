import React from 'react';
import Item, { ItemProps } from './Item';

interface ItemListProps {
    items: ItemProps[];
    onAddFavorite: (item: ItemProps) => void;
    onRemove: (index: number) => void;
    onAddToCart: (item: ItemProps) => void;
    onRemoveCategory: (category: string) => void;
    categories: string[];
}

interface CategorizedItems {
    [category: string]: ItemProps[];
}

const ItemList: React.FC<ItemListProps> = ({ items, onAddFavorite, onRemove, onAddToCart, onRemoveCategory, categories }) => {
    const categorizedItems: CategorizedItems = {};

    items.forEach(item => {
        const category = item.category || 'Uncategorized';
        categorizedItems[category] = categorizedItems[category] || [];
        categorizedItems[category].push(item);
    });

    return (
        <div className="item-list">
            <h2>Shopping List</h2>
            {categories.map(category => (
                <ul key={category} className="category-list">
                    <li className="category-item">
                        <h3>{category !== 'Uncategorized' ? category : 'Other'}</h3>
                        <ul>
                            {categorizedItems[category]?.map((item, index) => (
                                <li key={index}>
                                    <Item {...item} />
                                    <button onClick={() => onAddFavorite(item)}>Add to Favorites</button>
                                    <button onClick={() => onRemove(index)}>Remove</button>
                                    <button onClick={() => onAddToCart(item)}>Add Cart</button>
                                </li>
                            ))}
                        </ul>
                        <div className="category-actions">
                            <button onClick={() => onRemoveCategory(category)}>Remove Category</button>
                        </div>
                    </li>
                </ul>
            ))}
        </div>
    );
};

export default ItemList;
