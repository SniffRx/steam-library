import { itemVariants } from '@/pages/Welcome/types';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

export const LeftColumn = () => {
    const { auth } = usePage<SharedData>().props;

    return (
        <motion.div variants={itemVariants} className="flex-1 space-y-8">
            <h1 className="font-['Instrument Sans'] text-5xl leading-tight font-bold lg:text-6xl bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                Track Your Gaming Journey Like Never Before
            </h1>

            <p className="max-w-2xl text-lg text-slate-300 leading-relaxed">
                SteamLibrary helps you organize your game collection, track achievements, and share your progress with friends. Never lose track of your gaming accomplishments again.
            </p>

            <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href={auth.user ? route('dashboard') : route('login')}
                        className="inline-block rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-3.5 text-base font-semibold text-slate-900 transition-all duration-300 hover:from-cyan-300 hover:to-blue-400 shadow-xl shadow-cyan-500/25"
                    >
                        Get Started
                    </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href="#features"
                        className="inline-block rounded-xl border border-white/20 bg-white/5 backdrop-blur-md px-8 py-3.5 text-base font-medium text-slate-100 transition-all duration-300 hover:bg-white/10"
                    >
                        Learn More
                    </Link>
                </motion.div>
            </div>

            <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                        <img
                            key={i}
                            src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 20}.jpg`}
                            alt="User"
                            className="h-10 w-10 rounded-full border-2 border-slate-900 ring-2 ring-white/10"
                        />
                    ))}
                </div>
                <p className="text-sm text-slate-300">
                    Join <span className="font-semibold text-cyan-400">10,000+</span> gamers already tracking their progress
                </p>
            </div>
        </motion.div>
    );
};
