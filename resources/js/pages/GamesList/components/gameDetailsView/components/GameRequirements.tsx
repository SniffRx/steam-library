import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { Platforms } from '@/pages/GamesList/components/gameDetailsView/components/Platforms';
import { Monitor, Zap } from 'lucide-react';

export const GameRequirements = ({ info }: { info: any }) => {
    const [activeTab, setActiveTab] = useState<'min' | 'rec'>('min');

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
        <section className="rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <Monitor className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Системные требования</h3>
            </div>

            {/* Platforms */}
            <Platforms info={info} />

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('min')}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        activeTab === 'min'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-slate-900/40 text-slate-400 border border-white/5 hover:bg-slate-900/60'
                    }`}
                >
                    <Monitor className="w-4 h-4" />
                    Минимальные
                </button>

                {hasRec && (
                    <button
                        onClick={() => setActiveTab('rec')}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            activeTab === 'rec'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-slate-900/40 text-slate-400 border border-white/5 hover:bg-slate-900/60'
                        }`}
                    >
                        <Zap className="w-4 h-4" />
                        Рекомендуемые
                    </button>
                )}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="grid md:grid-cols-3 gap-4"
                >
                    {activeTab === 'min' ? (
                        <>
                            {info.pc_requirements?.minimum && (
                                <RequirementBox title="Windows" html={info.pc_requirements.minimum} icon="🪟" />
                            )}
                            {info.mac_requirements?.minimum && (
                                <RequirementBox title="macOS" html={info.mac_requirements.minimum} icon="🍎" />
                            )}
                            {info.linux_requirements?.minimum && (
                                <RequirementBox title="Linux" html={info.linux_requirements.minimum} icon="🐧" />
                            )}
                        </>
                    ) : (
                        <>
                            {info.pc_requirements?.recommended && (
                                <RequirementBox title="Windows" html={info.pc_requirements.recommended} icon="🪟" />
                            )}
                            {info.mac_requirements?.recommended && (
                                <RequirementBox title="macOS" html={info.mac_requirements.recommended} icon="🍎" />
                            )}
                            {info.linux_requirements?.recommended && (
                                <RequirementBox title="Linux" html={info.linux_requirements.recommended} icon="🐧" />
                            )}
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </section>
    );
};

const RequirementBox = ({ title, html, icon }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 border border-white/5 h-full"
    >
        <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{icon}</span>
            <h4 className="font-semibold text-white">{title}</h4>
        </div>
        <div
            className="text-sm text-slate-300 prose prose-invert prose-sm [&>ul]:list-none [&>ul]:pl-0 [&>ul>li]:mb-2 [&_strong]:text-slate-200"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    </motion.div>
);

export default GameRequirements;
