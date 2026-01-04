
import React from 'react';
import { useParams } from 'react-router-dom';
import Dashboard from './Dashboard';
import { Topic } from '../types';

interface CategoryDashboardProps {
    topics: Topic[];
}

const CategoryDashboard: React.FC<CategoryDashboardProps> = ({ topics }) => {
    const { categoryId } = useParams<{ categoryId: string }>();

    // Case-insensitive comparison if needed, but IDs are usually strict. 
    // We matched IDs in CategoryList to be capitalized (e.g. 'Política'), so direct match is fine.
    // We can decodeURIComponent just in case.
    const decodedCategory = categoryId ? decodeURIComponent(categoryId) : '';

    const filteredTopics = topics.filter(t => t.category === decodedCategory);

    return (
        <Dashboard
            topics={filteredTopics}
            title={`Debates de ${decodedCategory}`}
            showFilters={false} // Don't show the chip filters since we are already in a category
        />
    );
};

export default CategoryDashboard;
