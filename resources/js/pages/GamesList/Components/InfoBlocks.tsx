import React from 'react';
import { GameDetails } from './Types/GameTypes';

interface InfoBlocksProps {
    details: GameDetails | null;
}

export default function InfoBlocks({ details }: InfoBlocksProps) {
    const [activeTab, setActiveTab] = React.useState<'requirements' | 'categories'>('requirements');

    // Категории игры
    const categories = details?.categories?.map(cat => cat.description) || [];

    return (
        <div className="space-y-6">
            {/* Полное описание игры */}
            {details?.about_the_game && (
                <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-md p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M18 3a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1h16z" />
                            <path d="M2 5h16v10H2V5z" />
                            <path d="M14 9a2 2 0 10-4 0 2 2 0 004 0z" />
                        </svg>
                        About the Game
                    </h2>
                    <div
                        className="prose prose-invert max-w-none text-gray-300 text-sm"
                        dangerouslySetInnerHTML={{ __html: details.about_the_game }}
                    />
                    {details.website && (
                        <a
                            href={details.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Visit Official Website
                            <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M11 3a1 0 00-1 1v2H8a1 0 00-1 1v2H5a1 0 00-1 1v2a1 0 0 0 1 1h2v2a1 0 0 0 1 1h2v2a1 0 001 1h2a1 0 001-1v-2h2a1 0 0 01-1v-2h2a1 0 0 0-1-1v-2a1 0 0 0-1-1h-2V4a1 0 0 0-1-1h-2z"
                                />
                            </svg>
                        </a>
                    )}
                </div>
            )}

            {/* Системные требования / Категории */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-md p-6">
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={() => setActiveTab('requirements')}
                        className={`font-medium px-3 py-1 border-b-2 ${
                            activeTab === 'requirements'
                                ? 'border-blue-500 text-blue-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        System Requirements
                    </button>
                    {categories.length > 0 && (
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`font-medium px-3 py-1 border-b-2 ${
                                activeTab === 'categories'
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-gray-300'
                            }`}
                        >
                            Categories
                        </button>
                    )}
                </div>

                {/* Таб: Системные требования */}
                {activeTab === 'requirements' && (
                    <div className="space-y-4">
                        {details?.pc_requirements?.minimum ? (
                            <div
                                className="prose prose-invert max-w-none text-gray-300 text-sm"
                                dangerouslySetInnerHTML={{ __html: details.pc_requirements.minimum }}
                            />
                        ) : (
                            <p className="text-gray-400 italic">No system requirements specified</p>
                        )}

                        {details?.mac_requirements?.minimum && (
                            <div className="mt-4 pt-3 border-t border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">macOS Requirements</h4>
                                <div
                                    className="prose prose-invert max-w-none text-gray-300 text-sm"
                                    dangerouslySetInnerHTML={{ __html: details.mac_requirements.minimum }}
                                />
                            </div>
                        )}

                        {details?.linux_requirements?.minimum && (
                            <div className="mt-4 pt-3 border-t border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-300 mb-2">Linux Requirements</h4>
                                <div
                                    className="prose prose-invert max-w-none text-gray-300 text-sm"
                                    dangerouslySetInnerHTML={{ __html: details.linux_requirements.minimum }}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Таб: Категории */}
                {activeTab === 'categories' && (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400">This game is categorized as:</p>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-white"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>

                        {/* Steam Deck совместимость */}
                        {details?.deck_compatibility && (
                            <div className="mt-4 pt-3 border-t border-gray-700 flex items-center gap-2">
                                <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M10 18a8 8 0 008-8V6a2 2 0 00-2-2H4a2 2 0 00-2 2v5a2 2 0 002 2h1a2 2 0 012 2 2V9a2 2 0 012-2z" />
                                </svg>
                                <span className="text-sm text-cyan-400">
                                    {details.deck_compatibility.compatible
                                        ? '✅ Fully compatible with Steam Deck'
                                        : '❌ Not optimized for Steam Deck'}
                                </span>
                            </div>
                        )}

                        {/* DLC */}
                        {/*{details?.dlc?.length > 0 && (*/}
                        {/*    <div className="mt-4 pt-3 border-t border-gray-700 flex items-center gap-2">*/}
                        {/*        <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">*/}
                        {/*            <path d="M5 4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5zm0 2h10v8H5V6z" />*/}
                        {/*            <path d="M13 3a1 1 0 011 1v1a1 1 0 01-1 1h-1V3h1z" />*/}
                        {/*            <path d="M13 11a1 1 0 01-1-1V9a1 1 0 012 0v3a1 1 0 01-1-1z" />*/}
                        {/*        </svg>*/}
                        {/*        <span className="text-sm text-orange-400">*/}
                        {/*            This game has {details.dlc.length} DLC pack{details.dlc.length !== 1 ? 's' : ''}*/}
                        {/*        </span>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                )}
            </div>
        </div>
    );
}
