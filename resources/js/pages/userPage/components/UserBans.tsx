import { motion } from 'framer-motion';

export const UserBans = ({bans}: {bans: userBans}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-[#66C0F4]/20 bg-[#1B2838]/50 p-6"
        >
            <h2 className="mb-4 text-xl font-bold text-[#66C0F4]">Статус банов</h2>
            <div className="space-y-3">
                {[
                    {
                        type: 'Game Bans',
                        status: bans.NumberOfGameBans === 0,
                        extra: bans.NumberOfGameBans > 0 ? `(${bans.NumberOfGameBans} ban)` : '',
                    },
                    {
                        type: 'VAC Bans',
                        status: !bans.VACBanned,
                        extra: bans.VACBanned ? `(${bans.NumberOfVACBans} ban, ${bans.DaysSinceLastBan} days ago)` : '',
                    },
                    {
                        type: 'Community Ban',
                        status: !bans.CommunityBanned,
                    },
                    {
                        type: 'Trade Ban',
                        status: bans.EconomyBan === 'none',
                        label: bans.EconomyBan === 'none' ? 'In Good Standing' : bans.EconomyBan,
                    },
                ].map((ban, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <span className="text-[#C7D5E0]">
                            {ban.type} {ban.extra && <span className="text-xs opacity-70">{ban.extra}</span>}
                        </span>
                        <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                                ban.status ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}
                        >
                            {ban.label || (ban.status ? 'In Good Standing' : 'Banned')}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
