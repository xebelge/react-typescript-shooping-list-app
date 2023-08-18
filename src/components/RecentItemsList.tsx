import React from 'react';
import Item, { ItemProps } from './Item';

interface RecentItemsListProps {
    recentItems: ItemProps[];
}

const RecentItemsList: React.FC<RecentItemsListProps> = ({ recentItems }) => {
    return (
        <div className='recent-items-list'>
            <h2>Recently Added Items</h2>
            {recentItems.length === 0 ? (
                <p>No recent items yet.</p>
            ) : (
                <ul>
                    {recentItems.map((item, index) => (
                        <li key={index}>
                            <Item {...item} />
                        </li>
                    ))
                    }
                </ul>
            )

            }
        </div>
    );
};

export default RecentItemsList;
