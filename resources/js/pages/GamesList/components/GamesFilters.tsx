import React from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';

interface GamesFiltersProps {
    onFilterChange: (filters: Partial<{ search: string; status: string; sort: string }>) => void;
    currentFilters: {
        search: string;
        status: string;
        sort: string;
    };
}

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
        <div className="sticky top-6 bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Фильтры</h2>
            </div>

            {/* Search */}
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Поиск</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Название игры..."
                        value={currentFilters.search}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                </div>
            </div>

            {/* Sort */}
            <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
                    <SortAsc className="w-4 h-4" />
                    Сортировка
                </label>
                <select
                    value={
                        currentFilters.sort === 'name'
                            ? 'Alphabetical'
                            : currentFilters.sort === 'playtime'
                                ? 'Play Time'
                                : 'Recently Played'
                    }
                    onChange={handleSort}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                    <option>Recently Played</option>
                    <option>Alphabetical</option>
                    <option>Play Time</option>
                </select>
            </div>

            {/* Status */}
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-3">Статус</label>
                <div className="space-y-2">
                    {[
                        { key: 'all', label: 'Все игры' },
                        { key: 'completed', label: 'Завершённые' },
                        { key: 'in-progress', label: 'В процессе' }
                    ].map(({ key, label }) => (
                        <label
                            key={key}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="radio"
                                checked={currentFilters.status === key}
                                onChange={() => onFilterChange({ status: key })}
                                className="w-4 h-4 text-blue-500 bg-slate-900/50 border-white/10 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="text-slate-300 group-hover:text-white transition-colors">
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Divider with tip */}
            <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-slate-500 text-center">
                    💡 Используйте фильтры для быстрого поиска
                </p>
            </div>
        </div>
    );
};
