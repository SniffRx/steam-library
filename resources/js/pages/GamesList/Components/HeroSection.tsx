import React from 'react';

interface HeroSectionProps {
    details: {
        name?: string;
        header_image?: string;
        short_description?: string;
        website?: string;
        is_free?: boolean;
        price_overview?: { final_formatted: string };
        release_date?: { date: string; coming_soon: boolean };
        metacritic?: { score: number; url: string };
        deck_compatibility?: { compatible: boolean; note: string };
    } | null;
    game: {
        appid: number;
        name: string;
        playtime_forever: number;
        achievements?: { achieved: boolean }[];
    };
    isCompleted: boolean;
    onCompletion: () => void;
}

export default function HeroSection({ details, game }: HeroSectionProps) {

    // Последнее время игры
    const lastPlayed = game.playtime_forever > 0
        ? `${(game.playtime_forever / 60).toFixed(0)} hours`
        : 'No playtime yet';

    return (
        <div
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl transition-transform hover:scale-[1.01] duration-300">
            {/* Фоновое изображение */}
            <div
                className="h-64 md:h-96 bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center relative">
                {details?.header_image && (
                    <img
                        src={details.header_image}
                        alt={details.name || game.name}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                    />
                )}
                <div
                    className={`absolute inset-0 bg-gradient-to-t ${details?.header_image ? 'from-black/80 via-black/20' : 'from-black via-black'} to-transparent transition-all`}
                />

                {/* Текст поверх фона */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-lg">
                                {details?.name || game.name}
                            </h1>
                            {details?.short_description && (
                                <p className="mt-2 max-w-2xl line-clamp-2 text-sm md:text-base text-gray-200 hidden md:block">
                                    {details.short_description}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col items-start md:items-end space-y-3">
                            {/* Цена и дата релиза */}
                            <div className="flex flex-wrap gap-2">
                                {details?.price_overview?.final_formatted && (
                                    <div
                                        className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-xs md:text-sm font-medium flex items-center gap-1 backdrop-blur-md border border-green-400/20 hover:bg-green-600/30 transition-colors cursor-pointer"
                                        onClick={() => window.open(details.website || '#', '_blank')}
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                d="M8.433 7.418c.155-.103.343-.196.537-.275 2.81-.284 6.196.519 6.785 2.726.22.816.08 1.983-.26 2.954l-.11.35a2 2 0 01-1.82 1.487h-1.994c-.6.001-1.05-.403-1.05-1.003 0-.6 1.05-1.003 1.05-1.003"></path>
                                        </svg>
                                        {details.is_free ? 'Free' : details.price_overview?.final_formatted || 'Unknown'}
                                    </div>
                                )}

                                {details?.release_date?.date && !details.release_date.coming_soon && (
                                    <div
                                        className="px-3 py-1 rounded-full bg-gray-700/40 text-gray-300 text-xs md:text-sm flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M3 7h18M3 11h18M3 15h18" />
                                        </svg>
                                        {details.release_date.date}
                                    </div>
                                )}
                            </div>

                            {/* Мета информация (рейтинги, платформы) */}
                            <div className="flex flex-row-reverse flex-wrap gap-4">
                                {/* Metacritic */}
                                {details?.metacritic?.score && (
                                    <div
                                        className={`rounded-md px-3 py-1 text-sm font-medium ${
                                            details.metacritic.score >= 75
                                                ? 'bg-green-600/20 text-green-400'
                                                : details.metacritic.score >= 50
                                                    ? 'bg-yellow-600/20 text-yellow-400'
                                                    : 'bg-red-600/20 text-red-400'
                                        } flex items-center gap-1`}>
                                        <span>{details.metacritic.score}</span>
                                        <span className="uppercase text-xs">Metacritic</span>
                                    </div>
                                )}

                                {/* Steam Deck совместимость */}
                                {details?.deck_compatibility?.compatible && (
                                    <div
                                        className="bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium rounded-md px-3 py-1 flex items-center gap-1 hover:bg-cyan-600/30 transition-colors">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                                            <path d="M12 8v4l3 3" />
                                        </svg>
                                        Compatible
                                    </div>
                                )}

                                {/* Время в игре */}
                                <div
                                    className="bg-blue-600/20 text-blue-400 text-sm font-medium rounded-md px-3 py-1 flex items-center gap-1 hover:bg-blue-600/30 transition-colors">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 2a1 1 0 100 2 1 1 0 000-2z" />
                                        <path d="M10 12a1 1 0 100-2 1 1 0 000 2z" />
                                        <path fillRule="evenodd"
                                              d="M10 6a1 1 0 100-2 1 1 0 000 2z"
                                              clipRule="evenodd" />
                                    </svg>
                                    {lastPlayed}
                                </div>
                            </div>

                            {/*/!* Кнопка "Mark as Completed" *!/*/}
                            {/*<button*/}
                            {/*    onClick={onCompletion}*/}
                            {/*    onMouseEnter={() => setHovered(true)}*/}
                            {/*    onMouseLeave={() => setHovered(false)}*/}
                            {/*    className={`w-full md:w-auto mt-3 px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-bold transition-all duration-300 transform ${*/}
                            {/*        isCompleted*/}
                            {/*            ? 'bg-green-600/90 hover:bg-green-700 text-white'*/}
                            {/*            : 'bg-blue-600/90 hover:bg-blue-700 text-white'*/}
                            {/*    } ${hovered ? 'shadow-lg shadow-blue-500/30' : ''}`}*/}
                            {/*>*/}
                            {/*    {isCompleted ? (*/}
                            {/*        <>*/}
                            {/*            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">*/}
                            {/*                <path fillRule="evenodd"*/}
                            {/*                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"*/}
                            {/*                      clipRule="evenodd" />*/}
                            {/*            </svg>*/}
                            {/*            Completed*/}
                            {/*        </>*/}
                            {/*    ) : 'Mark as Completed'}*/}
                            {/*</button>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
