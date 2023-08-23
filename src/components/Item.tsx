import React from 'react';

export interface ItemProps {
    name: string;
    quantity: number;
    price: number;
    category?: string;
}

const Item: React.FC<ItemProps> = ({ name, quantity, price, category }) => {
    return (
        <div className="item">
            <div>{name}</div>
            {category && <div>Category: {category}</div>}
            {quantity && <div>Quantity: {quantity}</div>}
            {price && <div>Price: {price}</div>}
        </div>
    );
};

export default Item;
