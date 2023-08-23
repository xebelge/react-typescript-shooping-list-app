import React from 'react';
import Item, { ItemProps } from './Item';

interface FavoritesListProps {
    favoriteItems: ItemProps[];
    onRemove: (index: number) => void;
    onAddToCart: (item: ItemProps) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favoriteItems, onRemove, onAddToCart }) => {
    return (
        <div className="favorites-list">
            <h2>Favorite Items</h2>
            {favoriteItems.length === 0 ? (
                <p>No favorite items yet.</p>
            ) : (
                <ul>
                    {favoriteItems.map((item, index) => (
                        <li key={index}>
                            <Item {...item} />
                            <button onClick={() => onRemove(index)}>Remove</button>
                            <button onClick={() => onAddToCart(item)}>Add to Cart</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FavoritesList;
