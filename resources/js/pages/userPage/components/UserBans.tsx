import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export const UserBans = ({ bans }) => {
    const hasCriticalBans = bans.VACBanned || bans.CommunityBanned || bans.NumberOfGameBans > 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-white/20 hover:shadow-xl hover:shadow-white/5"
        >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

            <div className="relative mb-6 flex items-center gap-4">
                {hasCriticalBans ? (
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="rounded-full bg-gradient-to-br from-red-500/20 to-rose-600/20 p-3 shadow-lg shadow-red-500/20">
                        <ShieldAlert className="h-7 w-7 text-red-400" />
                    </motion.div>
                ) : (
                    <div className="rounded-full bg-gradient-to-br from-emerald-500/20 to-green-600/20 p-3 shadow-lg shadow-emerald-500/20">
                        <ShieldCheck className="h-7 w-7 text-emerald-400" />
                    </div>
                )}

                <div className="flex-1">
                    <h2 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-xl font-bold text-transparent">
                        Статус банов
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">{hasCriticalBans ? 'Обнаружены ограничения' : 'Все в порядке'}</p>
                </div>
            </div>

            <div className="relative space-y-3">
                {[
                    {
                        type: 'Game Bans',
                        icon: AlertTriangle,
                        status: bans.NumberOfGameBans === 0,
                        extra: bans.NumberOfGameBans > 0 ? `${bans.NumberOfGameBans} ban${bans.NumberOfGameBans > 1 ? 's' : ''}` : null,
                        severity: 'high'
                    },
                    {
                        type: 'VAC Bans',
                        icon: ShieldAlert,
                        status: !bans.VACBanned,
                        extra: bans.VACBanned ? `${bans.NumberOfVACBans} ban${bans.NumberOfVACBans > 1 ? 's' : ''}, ${bans.DaysSinceLastBan} дн. назад` : null,
                        severity: 'critical'
                    },
                    {
                        type: 'Community Ban',
                        icon: ShieldAlert,
                        status: !bans.CommunityBanned,
                        severity: 'high'
                    },
                    {
                        type: 'Trade Ban',
                        icon: AlertTriangle,
                        status: bans.EconomyBan === 'none',
                        label: bans.EconomyBan === 'none' ? null : bans.EconomyBan,
                        severity: 'medium'
                    }
                ].map((ban, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.01, x: 2 }} className="group/item relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-r from-white/5 to-white/[0.02] p-4 backdrop-blur-sm transition-all hover:border-white/10">
                        <div className={`absolute inset-0 opacity-0 transition-opacity group-hover/item:opacity-100 ${ban.status ? 'bg-gradient-to-r from-emerald-500/5 to-transparent' : 'bg-gradient-to-r from-red-500/5 to-transparent'}`} />

                        <div className="relative flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <ban.icon className={`h-4 w-4 ${ban.status ? 'text-gray-400' : 'text-red-400'}`} />
                                <div>
                                    <span className="font-medium text-gray-200">{ban.type}</span>
                                    {ban.extra && (<p className="mt-0.5 text-xs text-gray-500">{ban.extra}</p>)}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {ban.label && <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">{ban.label}</span>}
                                <motion.span whileHover={{ scale: 1.05 }} className={`rounded-full px-3 py-1.5 text-sm font-semibold shadow-lg ${ban.status ? 'bg-gradient-to-r from-emerald-500/20 to-green-600/20 text-emerald-400 shadow-emerald-500/20' : 'bg-gradient-to-r from-red-500/20 to-rose-600/20 text-red-400 shadow-red-500/20'}`}>
                                    {ban.status ? 'Нет' : 'Да'}
                                </motion.span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default UserBans;
