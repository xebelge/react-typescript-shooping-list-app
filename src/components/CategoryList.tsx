import React from 'react';

interface CategoryListProps {
    categories: string[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
    return (
        <div className='category-list'>
            <h2>Categories</h2>
            <ul>
                {categories.map((category, index) => (
                    <li key={index}>{category}</li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;