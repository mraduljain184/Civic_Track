"use client";

import { useState } from "react";

const FilterBar = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categories = [
    "All",
    "Roads",
    "Lighting",
    "Water Supply",
    "Cleanliness",
    "Public Safety",
    "Obstructions",
  ];
  const statuses = ["All", "Reported", "In Progress", "Resolved"];
  const distances = [
    { value: "1", label: "1 km" },
    { value: "3", label: "3 km" },
    { value: "5", label: "5 km" },
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const newFilters = { ...localFilters, search: value };
    setLocalFilters(newFilters);

    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      onFilterChange(newFilters);
    }, 500);
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter */}
          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-300 mr-2">
              Category
            </label>
            <select
              value={localFilters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-300 mr-2">
              Status
            </label>
            <select
              value={localFilters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Distance Filter */}
          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-300 mr-2">
              Distance
            </label>
            <select
              value={localFilters.distance}
              onChange={(e) => handleFilterChange("distance", e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
            >
              {distances.map((distance) => (
                <option key={distance.value} value={distance.value}>
                  {distance.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search Issues..."
                value={localFilters.search}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
