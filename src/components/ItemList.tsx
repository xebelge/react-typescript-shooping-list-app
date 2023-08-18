import React from 'react';
import Item, { ItemProps } from './Item';

interface ItemListProps {
    items: ItemProps[];
    onAddFavorite: (item: ItemProps) => void;
    onRemove: (index: number) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onAddFavorite, onRemove }) => {
    return (
        <div className="item-list">
            {items.map((item, index) => (
                <div key={index}>
                    <Item {...item} />
                    <button onClick={() => onAddFavorite(item)}>Add to Favorites</button>
                    <button onClick={() => onRemove(index)}>Remove</button>
                </div>
            ))}
        </div>
    );
};

export default ItemList;
