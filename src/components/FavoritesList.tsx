import React from 'react';
import Item, { ItemProps } from './Item';

interface FavoritesListProps {
    favoriteItems: ItemProps[];
    onRemove: (index: number) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favoriteItems, onRemove }) => {
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FavoritesList;
