import React from 'react';

interface GamesFiltersProps {
    onFilterChange: (filters: Partial<{ search: string; status: string; sort: string }>) => void;
    currentFilters: {
        search: string;
        status: string;
        sort: string;
    };
}

const CheckboxOption = ({
                            label,
                            checked,
                            onChange,
                        }: {
    label: string;
    checked?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) => (
    <label className="flex items-center space-x-3">
        <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600 rounded"
            checked={checked}
            onChange={onChange}
        />
        <span className="text-gray-300">{label}</span>
    </label>
);

export const GamesFilters = ({ onFilterChange, currentFilters }: GamesFiltersProps) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ search: e.target.value });
    };

    const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        let sortValue = 'recent';
        if (value === 'Alphabetical') sortValue = 'name';
        else if (value === 'Play Time') sortValue = 'playtime';
        onFilterChange({ sort: sortValue });
    };

    return (
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Filters</h2>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Game name..."
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 pl-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleSearch}
                        value={currentFilters.search}
                    />
                    <svg
                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-md font-medium text-gray-300 mb-3">Sort By</h3>
                <select
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 px-3 text-white"
                    onChange={handleSort}
                    value={
                        currentFilters.sort === 'name'
                            ? 'Alphabetical'
                            : currentFilters.sort === 'playtime'
                                ? 'Play Time'
                                : 'Recently Played'
                    }
                >
                    <option>Recently Played</option>
                    <option>Alphabetical</option>
                    <option>Play Time</option>
                </select>

                <h3 className="text-md font-medium text-gray-300 mb-3">Status</h3>
                <div className="space-y-2">
                    <CheckboxOption
                        label="Completed"
                        checked={currentFilters.status === 'completed'}
                        onChange={() => onFilterChange({ status: 'completed' })}
                    />
                    <CheckboxOption
                        label="In Progress"
                        checked={currentFilters.status === 'in-progress'}
                        onChange={() => onFilterChange({ status: 'in-progress' })}
                    />
                    <CheckboxOption
                        label="All"
                        checked={currentFilters.status === 'all'}
                        onChange={() => onFilterChange({ status: 'all' })}
                    />
                </div>
            </div>
        </div>
    );
};
