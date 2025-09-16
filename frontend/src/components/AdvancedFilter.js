import React from 'react';

const AdvancedFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  priority,
  onPriorityChange,
  pinned,
  onPinnedChange,
  showArchived,
  onShowArchivedChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange
}) => {
  return (
    <div className="advanced-filter">
      <div className="filter-group">
        <label htmlFor="category-filter">Category:</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="priority-filter">Priority:</label>
        <select
          id="priority-filter"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="pinned-filter">Pinned:</label>
        <select
          id="pinned-filter"
          value={pinned}
          onChange={(e) => onPinnedChange(e.target.value)}
          className="filter-select"
        >
          <option value="">All Notes</option>
          <option value="true">Pinned Only</option>
          <option value="false">Not Pinned</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-by">Sort By:</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="filter-select"
        >
          <option value="updatedAt">Last Updated</option>
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
          <option value="category">Category</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-order">Order:</label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value)}
          className="filter-select"
        >
          <option value="DESC">Newest First</option>
          <option value="ASC">Oldest First</option>
        </select>
      </div>

      <div className="filter-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => onShowArchivedChange(e.target.checked)}
          />
          Show Archived
        </label>
      </div>
    </div>
  );
};

export default AdvancedFilter;


