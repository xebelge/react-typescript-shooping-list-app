import React from 'react';

export interface ItemProps {
    name: string;
    quantity?: number;
    price?: number;
}

const Item: React.FC<ItemProps> = ({ name, quantity, price }) => {
    return (
        <div className="item">
            <div>{name}</div>
            {quantity && <div>Quantity: {quantity}</div>}
            {price && <div>Price: {price}</div>}
        </div>
    );
};

export default Item;
