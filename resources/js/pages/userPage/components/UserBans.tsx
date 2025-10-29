import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export const UserBans = ({ bans }) => {
    const hasBans = bans.VACBanned || bans.CommunityBanned || bans.NumberOfGameBans > 0;

    const banItems = [
        {
            label: 'Game Bans',
            value: bans.NumberOfGameBans === 0 ? 'Нет' : `${bans.NumberOfGameBans}`,
            isBanned: bans.NumberOfGameBans > 0
        },
        {
            label: 'VAC Bans',
            value: !bans.VACBanned ? 'Нет' : `${bans.NumberOfVACBans}`,
            isBanned: bans.VACBanned
        },
        {
            label: 'Community Ban',
            value: bans.CommunityBanned ? 'Да' : 'Нет',
            isBanned: bans.CommunityBanned
        },
        {
            label: 'Trade Ban',
            value: bans.EconomyBan === 'none' ? 'Нет' : bans.EconomyBan,
            isBanned: bans.EconomyBan !== 'none'
        },
    ];

    return (
        <div className="bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    {hasBans ? (
                        <ShieldAlert className="w-6 h-6 text-red-400" />
                    ) : (
                        <ShieldCheck className="w-6 h-6 text-green-400" />
                    )}
                    <div>
                        <h3 className="font-bold text-lg">Статус банов</h3>
                        <p className="text-sm text-slate-400">
                            {hasBans ? 'Обнаружены ограничения' : 'Все в порядке'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {banItems.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 border border-white/5 text-center"
                    >
                        <p className="text-xs text-slate-400 mb-2">{item.label}</p>
                        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                            item.isBanned
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                            {item.value}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default UserBans;
