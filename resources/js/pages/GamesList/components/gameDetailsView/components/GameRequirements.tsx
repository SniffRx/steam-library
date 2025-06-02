import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { Platforms } from '@/pages/GamesList/components/gameDetailsView/components/Platforms';

export const GameRequirements = ({info}: {info:any}) => {
    const [activeTab, setActiveTab] = useState<"min" | "rec">("min");

    const hasMin =
        info.pc_requirements?.minimum ||
        info.mac_requirements?.minimum ||
        info.linux_requirements?.minimum;

    const hasRec =
        info.pc_requirements?.recommended ||
        info.mac_requirements?.recommended ||
        info.linux_requirements?.recommended;

    if (!hasMin && !hasRec) return null;

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
        >
            <h3 className="text-xl font-semibold text-white mb-4">Системные требования</h3>
            {/* Платформы */}
            <Platforms info={info} />
            {/* Горизонтальные табы */}
            <div className="flex mb-4 border-b border-gray-700">
                <button
                    onClick={() => setActiveTab("min")}
                    className={`relative px-4 py-2 text-sm ${
                        activeTab === "min" ? "text-white" : "text-gray-400 hover:text-gray-300"
                    } transition-colors`}
                >
                    Минимальные
                    {activeTab === "min" && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                        />
                    )}
                </button>

                {hasRec && (
                    <button
                        onClick={() => setActiveTab("rec")}
                        className={`relative px-4 py-2 text-sm ${
                            activeTab === "rec" ? "text-white" : "text-gray-400 hover:text-gray-300"
                        } transition-colors`}
                    >
                        Рекомендуемые
                        {activeTab === "rec" && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                            />
                        )}
                    </button>
                )}
            </div>

            {/* Горизонтальное расположение контента */}
            <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ x: activeTab === "min" ? -50 : 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: activeTab === "min" ? 50 : -50, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-3 md:grid-cols-3 gap-4"
                    >
                        {activeTab === "min" ? (
                            <>
                                    {info.pc_requirements?.minimum && (
                                        <div className="space-y-4">
                                        <RequirementBox title="PC Минимальные" html={info.pc_requirements.minimum} />
                                        </div>
                                    )}
                                    {info.mac_requirements?.minimum && (
                                        <div className="space-y-4">
                                        <RequirementBox title="Mac Минимальные" html={info.mac_requirements.minimum} />
                                        </div>
                                    )}
                                    {info.linux_requirements?.minimum && (
                                        <div className="space-y-4">
                                        <RequirementBox title="Linux+SteamOS Минимальные" html={info.linux_requirements.minimum} />
                                        </div>
                                    )}
                            </>
                        ) : (
                            <>
                                    {info.pc_requirements?.recommended && (
                                        <div className="space-y-4">
                                        <RequirementBox title="PC Рекомендуемые" html={info.pc_requirements.recommended} />
                                        </div>
                                    )}
                                    {info.mac_requirements?.recommended && (
                                        <div className="space-y-4">
                                        <RequirementBox title="Mac Рекомендуемые" html={info.mac_requirements.recommended} />
                                        </div>
                                    )}
                                    {info.linux_requirements?.recommended && (
                                        <div className="space-y-4">
                                        <RequirementBox title="Linux+SteamOS Рекомендуемые" html={info.linux_requirements.recommended} />
                                        </div>
                                    )}
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.section>
    );
};

// Адаптированный RequirementBox для горизонтального расположения
const RequirementBox = ({ title, html }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 h-full"
    >
        <h4 className="text-lg font-medium text-white mb-2">{title}</h4>
        <div
            className="text-gray-300 prose prose-invert prose-sm"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    </motion.div>
);
