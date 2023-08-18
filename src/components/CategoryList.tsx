import React, { useState } from 'react';

interface CategoryListProps {
    categories: string[];
    onAddCategory: (category: string) => void;
    onRemoveCategory: (index: number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
    categories,
    onAddCategory,
    onRemoveCategory,
}) => {
    const [newCategory, setNewCategory] = useState('');

    const handleAddCategory = (): void => {
        if (newCategory.trim() !== '') {
            onAddCategory(newCategory);
            setNewCategory('');
        }
    };

    return (
        <div className="category-list">
            <h2>Categories</h2>
            <ul>
                {categories.map((category, index) => (
                    <li key={index}>
                        {category}
                        <button onClick={() => onRemoveCategory(index)}>Remove</button>
                    </li>
                ))}
            </ul>
            <div className="add-category">
                <input
                    type="text"
                    placeholder="New category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button onClick={handleAddCategory}>Add Category</button>
            </div>
        </div>
    );
};

export default CategoryList;
