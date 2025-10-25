import { motion } from 'framer-motion';

export default function AvatarSection({ userInfo, status, userLevel }) {
    return (
        <div className="flex-shrink-0">
            <motion.div whileHover={{ scale: 1.05, rotate: 2 }} transition={{ type: "spring", stiffness: 300 }} className="relative mx-auto lg:mx-0">
                <div className={`absolute inset-0 animate-pulse rounded-full bg-gradient-to-r ${status.gradient} opacity-50 blur-xl`} />
                <div className="relative">
                    <img src={userInfo.avatarfull} alt={userInfo.personaname} className="relative z-10 h-36 w-36 rounded-full border-4 border-white/20 shadow-2xl backdrop-blur-sm md:h-44 md:w-44" />
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="absolute -bottom-3 left-1/2 z-20 -translate-x-1/2 transform rounded-full border border-white/20 bg-gradient-to-r from-gray-900 to-black px-4 py-1.5 shadow-lg backdrop-blur-md">
                        <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-sm font-bold text-transparent">Level {userLevel}</span>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
