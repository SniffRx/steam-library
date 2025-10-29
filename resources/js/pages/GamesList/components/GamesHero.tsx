import { motion } from 'framer-motion';
import { Gamepad2, TrendingUp, Award } from 'lucide-react';

export const GamesHero = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl mb-8"
    >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-6"
            >
                <Gamepad2 className="w-8 h-8 text-blue-400" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Instrument_Sans'] bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                Ваша коллекция игр
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Отслеживайте прогресс, достижения и статистику в одном месте
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium"
                >
                    <TrendingUp className="w-4 h-4" />
                    <span>Отслеживание прогресса</span>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium"
                >
                    <Award className="w-4 h-4" />
                    <span>Достижения</span>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium"
                >
                    <Gamepad2 className="w-4 h-4" />
                    <span>Статистика</span>
                </motion.div>
            </div>
        </div>
    </motion.div>
);
